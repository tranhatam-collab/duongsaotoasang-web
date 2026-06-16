// FILE: /functions/api/referrals.js

export const onRequestGet = async ({ request, env }) => {
  try {
    const session = getSession(request, env)
    if (!session) {
      return json({ ok: false, error: "Unauthorized" }, 401)
    }

    if (!env.DB) {
      return json({ ok: true, data: { referral_code: null, referred_users: [], total_earnings: 0 } })
    }

    const stmt = env.DB.prepare(`
      SELECT 
        user_id,
        referral_code,
        total_referrals,
        total_earnings
      FROM users
      WHERE user_id = ?
    `).bind(session.user_id)

    const result = await stmt.first()

    if (!result) {
      return json({ ok: false, error: "User not found" }, 404)
    }

    const referredUsersStmt = env.DB.prepare(`
      SELECT
        referred_user_id,
        referred_at,
        status,
        reward
      FROM referrals
      WHERE referrer_user_id = ?
      ORDER BY datetime(referred_at) DESC
      LIMIT 50
    `).bind(session.user_id)

    const referredUsersResult = await referredUsersStmt.all()
    const referred_users = Array.isArray(referredUsersResult.results) ? referredUsersResult.results : []

    return json({ ok: true, data: { ...result, referred_users } })
  } catch (error) {
    console.error("Referrals API error:", error)
    return json({ ok: false, error: "Failed to fetch referral data" }, 500)
  }
}

function getSession(request, env) {
  const cookie = request.headers.get("Cookie") || ""
  const sessionMatch = cookie.match(/__Host-dsts_session=([^;]+)/)
  if (!sessionMatch) return null

  try {
    const sessionData = JSON.parse(atob(sessionMatch[1]))
    return sessionData
  } catch {
    return null
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  })
}
