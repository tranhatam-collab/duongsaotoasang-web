/**
 * functions/api/donate/[id].js
 * GET /api/donate/:id — get donation status by ID.
 * If status is still "pending" and pay.iai.one is reachable, performs
 * a real-time pull-through check against GET /v1/payments/:id to
 * capture completions that arrived before the webhook was processed.
 * Ref: docs/PAY_IAI_ONE_INTEGRATION_GROUND_TRUTH_2026-05-15.md §7
 */

import { sendAndLogDonationReceipt } from "../../_lib/email.js";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

/** Map pay.iai.one upstream status values → DSTS internal status */
function resolveUpstreamStatus(upstream) {
  if (!upstream) return null;
  const s = String(upstream).toLowerCase();
  if (["completed", "paid", "success", "settled"].includes(s)) return "completed";
  if (["failed", "error", "rejected"].includes(s)) return "failed";
  if (["cancelled", "canceled", "expired", "voided"].includes(s)) return "cancelled";
  return null; // still pending / unknown — no update
}

async function pollPayIaiOne(env, donationId) {
  if (!env.PAY_IAI_ONE_API_KEY) return null;
  const baseUrl = String(env.PAY_IAI_ONE_BASE_URL || "https://pay.iai.one").replace(/\/+$/, "");
  try {
    const resp = await fetch(`${baseUrl}/v1/payments/${encodeURIComponent(donationId)}`, {
      headers: {
        "x-api-key": String(env.PAY_IAI_ONE_API_KEY),
        "content-type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) return null;
    const data = await resp.json().catch(() => null);
    return data;
  } catch {
    return null;
  }
}

export const onRequestGet = async ({ params, env }) => {
  const { id: donationId } = params;
  if (!donationId) return errorJson("MISSING_ID", "Donation ID required.", 400);

  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);

  const row = await env.DB.prepare(
    "SELECT id, amount_vnd, status, checkout_url, donor_name, donor_email, created_at, completed_at FROM donations WHERE id = ?"
  ).bind(donationId).first();

  if (!row) return errorJson("NOT_FOUND", "Donation not found.", 404);

  // Pull-through polling: if still pending, check pay.iai.one for real status
  if (row.status === "pending" && env.PAY_IAI_ONE_API_KEY) {
    const upstream = await pollPayIaiOne(env, donationId);
    const resolved = resolveUpstreamStatus(upstream?.status || upstream?.payment_status);

    if (resolved && resolved !== "pending") {
      // Update D1 with resolved status
      if (resolved === "completed") {
        await env.DB.prepare(`
          UPDATE donations
          SET status = 'completed', completed_at = datetime('now'), updated_at = datetime('now')
          WHERE id = ? AND status = 'pending'
        `).bind(donationId).run();

        // Send + audit-log receipt via single canonical path
        await sendAndLogDonationReceipt(env, {
          donation: {
            id: donationId,
            donor_email: row.donor_email || null,
            donor_name: row.donor_name || null,
            amount_vnd: row.amount_vnd || 0,
          },
          source: "pull_through",
        }).catch(() => {});
      } else {
        await env.DB.prepare(`
          UPDATE donations
          SET status = ?, updated_at = datetime('now')
          WHERE id = ? AND status = 'pending'
        `).bind(resolved, donationId).run();
      }
      // Return fresh status
      return json({ ok: true, data: { ...row, status: resolved }, polled: true });
    }
  }

  return json({ ok: true, data: row });
};
