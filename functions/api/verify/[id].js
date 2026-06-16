// FILE: /functions/api/verify/[id].js

export const onRequestGet = async ({ request, env, params }) => {
  const userId = params.id

  try {
    if (!env.DB) {
      return json({ ok: false, error: "Database not available" }, 500)
    }

    const stmt = env.DB.prepare(`
      SELECT
        user_id,
        display_name,
        email,
        trust_score,
        verified_status,
        verified_at
      FROM users
      WHERE user_id = ?
    `).bind(userId)

    const result = await stmt.first()

    if (!result) {
      return json({ ok: false, error: "User not found" }, 404)
    }

    return json({ ok: true, data: result })
  } catch (error) {
    console.error("Verify API error:", error)
    return json({ ok: false, error: "Failed to fetch user verification data" }, 500)
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  })
}
