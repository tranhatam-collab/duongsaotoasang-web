// FILE: /functions/api/wallet.js

export const onRequestGet = async ({ request, env }) => {
  try {
    const session = getSession(request, env)
    if (!session) {
      return json({ ok: false, error: "Unauthorized" }, 401)
    }

    if (!env.DB) {
      return json({ ok: true, data: { balance: 0, points: 0, transactions: [] } })
    }

    const stmt = env.DB.prepare(`
      SELECT 
        user_id,
        display_name,
        star_points,
        balance
      FROM users
      WHERE user_id = ?
    `).bind(session.user_id)

    const result = await stmt.first()

    if (!result) {
      return json({ ok: false, error: "User not found" }, 404)
    }

    const transactionsStmt = env.DB.prepare(`
      SELECT
        transaction_id,
        type,
        amount,
        description,
        created_at
      FROM wallet_transactions
      WHERE user_id = ?
      ORDER BY datetime(created_at) DESC
      LIMIT 50
    `).bind(session.user_id)

    const transactionsResult = await transactionsStmt.all()
    const transactions = Array.isArray(transactionsResult.results) ? transactionsResult.results : []

    return json({ ok: true, data: { ...result, transactions } })
  } catch (error) {
    console.error("Wallet API error:", error)
    return json({ ok: false, error: "Failed to fetch wallet data" }, 500)
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
