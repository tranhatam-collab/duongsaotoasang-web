/**
 * functions/api/donate/[id].js
 * GET /api/donate/:id — get donation status by ID
 */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

export const onRequestGet = async ({ params, env }) => {
  const { id: donationId } = params;
  if (!donationId) return errorJson("MISSING_ID", "Donation ID required.", 400);

  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);

  const row = await env.DB.prepare(
    "SELECT id, amount_vnd, status, checkout_url, donor_name, created_at, completed_at FROM donations WHERE id = ?"
  ).bind(donationId).first();

  if (!row) return errorJson("NOT_FOUND", "Donation not found.", 404);

  return json({ ok: true, data: row });
};
