/**
 * functions/api/trust-iai/status/[[id]].js
 * GET /api/trust-iai/status/:id — check verification status
 */

export const onRequestGet = async ({ params, env }) => {
  const { id } = params;
  
  if (!env.DB) {
    return json({ ok: false, error: "Database not bound" }, 500);
  }

  try {
    const row = await env.DB.prepare(`
      SELECT user_id, trust_score, verified_status, verified_at
      FROM users
      WHERE user_id = ?
    `).bind(id).first();

    if (!row) {
      return json({ ok: false, error: "User not found" }, 404);
    }

    return json({
      ok: true,
      user_id: row.user_id,
      trust_score: row.trust_score,
      verified_status: row.verified_status,
      verified_at: row.verified_at
    });
  } catch (error) {
    console.error("Trust status check error:", error);
    return json({ ok: false, error: "Failed to check verification status" }, 500);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
