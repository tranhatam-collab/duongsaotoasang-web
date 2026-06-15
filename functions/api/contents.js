// FILE: /functions/api/contents.js

import {
  localizeItem,
  normalizeLang,
  selectFallback
} from "../_lib/content-data.js"

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url)
  const lang = normalizeLang(url.searchParams.get("lang"))
  const type = (url.searchParams.get("type") || "").trim()
  const limit = parseLimit(url.searchParams.get("limit"), 24, 100)
  const q = (url.searchParams.get("q") || "").trim()

  try {
    if (!env.DB) {
      return json(toListItems(selectFallback({ type, limit, q, lang })))
    }

    const queryParts = []
    const bindings = []

    queryParts.push(`
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
      WHERE 1 = 1
    `)

    if (type) {
      queryParts.push(`AND type = ?`)
      bindings.push(type)
    }

    if (q) {
      queryParts.push(`
        AND (
          slug LIKE ?
          OR title_vi LIKE ?
          OR title_en LIKE ?
          OR excerpt_vi LIKE ?
          OR excerpt_en LIKE ?
          OR content_vi LIKE ?
          OR content_en LIKE ?
          OR tags LIKE ?
        )
      `)
      const like = `%${q}%`
      bindings.push(like, like, like, like, like, like, like, like)
    }

    queryParts.push(`ORDER BY datetime(created_at) DESC LIMIT ?`)
    bindings.push(limit)

    const stmt = env.DB.prepare(queryParts.join("\n")).bind(...bindings)
    const result = await stmt.all()
    const rows = Array.isArray(result.results) ? result.results : []

    if (!rows.length) {
      return json(toListItems(selectFallback({ type, limit, q, lang })))
    }

    return json(rows.map((item) => toListItem(localizeItem(item, lang))))
  } catch (_error) {
    return json(toListItems(selectFallback({ type, limit, q, lang })))
  }
}

function toListItems(items) {
  return items.map((item) => toListItem(item))
}

function toListItem(item) {
  const {
    content,
    content_vi,
    content_en,
    ...metadata
  } = item
  return metadata
}

function parseLimit(value, fallback = 24, max = 100) {
  const n = Number.parseInt(value, 10)
  if (!Number.isFinite(n) || n <= 0) return fallback
  return Math.min(n, max)
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
