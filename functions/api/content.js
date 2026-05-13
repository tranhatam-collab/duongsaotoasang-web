import {
  findFallback,
  localizeItem,
  normalizeLang
} from "../_lib/content-data.js"

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url)
  const slug = (url.searchParams.get("slug") || "").trim()
  const lang = normalizeLang(url.searchParams.get("lang"))

  if (!slug) {
    return json({ error: "missing slug" }, 400)
  }

  const fallback = findFallback(slug, lang)

  try {
    if (!env.DB) {
      return fallback ? json(fallback) : json({ error: "not found" }, 404)
    }

    const query = `
      SELECT
        slug,
        type,
        title_vi,
        title_en,
        excerpt_vi,
        excerpt_en,
        content_vi,
        content_en,
        tags,
        cover_url,
        created_at
      FROM contents
      WHERE slug = ?
      LIMIT 1
    `

    const { results } = await env.DB.prepare(query).bind(slug).all()

    if (results && results.length > 0) {
      return json(localizeItem(results[0], lang))
    }

    return fallback ? json(fallback) : json({ error: "not found" }, 404)
  } catch (_err) {
    return fallback ? json(fallback) : json({ error: "server_error" }, 500)
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
