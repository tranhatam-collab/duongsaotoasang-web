// FILE: /functions/api/stories.js

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url)
  const limit = parseLimit(url.searchParams.get("limit"), 24, 100)
  const offset = parseOffset(url.searchParams.get("offset"), 0)

  try {
    if (!env.DB) {
      return json({ ok: true, stories: [], total: 0, limit, offset })
    }

    const countStmt = env.DB.prepare("SELECT COUNT(*) as total FROM contents WHERE type = 'story'")
    const countResult = await countStmt.first()
    const total = countResult?.total || 0

    const storiesStmt = env.DB.prepare(`
      SELECT
        slug,
        type,
        title_vi,
        title_en,
        excerpt_vi,
        excerpt_en,
        tags,
        cover_url,
        created_at
      FROM contents
      WHERE type = 'story'
      ORDER BY datetime(created_at) DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset)

    const result = await storiesStmt.all()
    const stories = Array.isArray(result.results) ? result.results : []

    return json({ ok: true, stories, total, limit, offset })
  } catch (error) {
    console.error("Stories API error:", error)
    return json({ ok: false, error: "Failed to fetch stories", stories: [], total: 0, limit, offset }, 500)
  }
}

function parseLimit(value, fallback = 24, max = 100) {
  const n = Number.parseInt(value, 10)
  if (!Number.isFinite(n) || n <= 0) return fallback
  return Math.min(n, max)
}

function parseOffset(value, fallback = 0) {
  const n = Number.parseInt(value, 10)
  if (!Number.isFinite(n) || n < 0) return fallback
  return n
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
