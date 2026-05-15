/**
 * functions/api/donate/poll.js
 * POST /api/donate/poll — sweep all stale "pending" donations and
 * reconcile status via pay.iai.one GET /v1/payments/:id.
 *
 * Intended callers:
 *   1. Manual: scripts/pay-owner-go-live.sh or curl after deploy
 *   2. External Cron Worker (separate tiny CF Worker calling this endpoint)
 *
 * Auth: requires x-poll-token matching env.POLL_TOKEN (or PAY_DSTS_HMAC
 * as fallback). If no token is set in env, only localhost/127.0.0.1 allowed.
 *
 * Ref: docs/PAY_IAI_ONE_INTEGRATION_GROUND_TRUTH_2026-05-15.md §7
 */

import { sendDonationReceipt } from "../../_lib/email.js";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

function resolveUpstreamStatus(upstream) {
  if (!upstream) return null;
  const s = String(upstream).toLowerCase();
  if (["completed", "paid", "success", "settled"].includes(s)) return "completed";
  if (["failed", "error", "rejected"].includes(s)) return "failed";
  if (["cancelled", "canceled", "expired", "voided"].includes(s)) return "cancelled";
  return null;
}

async function pollOne(env, baseUrl, donationId) {
  try {
    const resp = await fetch(`${baseUrl}/v1/payments/${encodeURIComponent(donationId)}`, {
      headers: {
        "x-api-key": String(env.PAY_IAI_ONE_API_KEY),
        "content-type": "application/json",
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!resp.ok) return null;
    return await resp.json().catch(() => null);
  } catch {
    return null;
  }
}

export const onRequestPost = async ({ request, env }) => {
  // Auth check
  const expectedToken = env.POLL_TOKEN || env.PAY_DSTS_HMAC || "";
  const providedToken = (
    request.headers.get("x-poll-token") ||
    request.headers.get("authorization")?.replace(/^bearer\s*/i, "") ||
    ""
  ).trim();

  if (expectedToken) {
    if (!providedToken || providedToken !== expectedToken) {
      return errorJson("UNAUTHORIZED", "Invalid or missing poll token.", 401);
    }
  }

  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);
  if (!env.PAY_IAI_ONE_API_KEY) return errorJson("PAYMENT_NOT_CONFIGURED", "Pay gateway not configured.", 503);

  const baseUrl = String(env.PAY_IAI_ONE_BASE_URL || "https://pay.iai.one").replace(/\/+$/, "");

  // Find pending donations older than 2 min (give webhook a chance first)
  // and not yet expired (within 30 min checkout window)
  const pendingRows = await env.DB.prepare(`
    SELECT id, donor_email, donor_name, amount_vnd
    FROM donations
    WHERE status = 'pending'
      AND created_at >= datetime('now', '-30 minutes')
      AND created_at <= datetime('now', '-2 minutes')
    ORDER BY created_at ASC
    LIMIT 50
  `).all();

  const rows = pendingRows?.results || [];
  if (rows.length === 0) return json({ ok: true, polled: 0, updated: 0 });

  let updated = 0;
  const results = [];

  for (const row of rows) {
    const data = await pollOne(env, baseUrl, row.id);
    const resolved = resolveUpstreamStatus(data?.status || data?.payment_status);

    if (!resolved) {
      results.push({ id: row.id, action: "no_change" });
      continue;
    }

    if (resolved === "completed") {
      await env.DB.prepare(`
        UPDATE donations
        SET status = 'completed', completed_at = datetime('now'), updated_at = datetime('now')
        WHERE id = ? AND status = 'pending'
      `).bind(row.id).run();

      // Best-effort receipt
      await sendDonationReceipt(env, {
        donorEmail: row.donor_email || null,
        donorName: row.donor_name || null,
        donationId: row.id,
        amountVnd: row.amount_vnd || 0,
      }).catch(() => {});

      updated++;
      results.push({ id: row.id, action: "completed" });
    } else {
      await env.DB.prepare(`
        UPDATE donations
        SET status = ?, updated_at = datetime('now')
        WHERE id = ? AND status = 'pending'
      `).bind(resolved, row.id).run();
      updated++;
      results.push({ id: row.id, action: resolved });
    }
  }

  return json({ ok: true, polled: rows.length, updated, results });
};
