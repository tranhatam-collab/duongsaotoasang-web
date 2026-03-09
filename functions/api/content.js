export const onRequestGet = async ({ request, env }) => {

  try {

    const url = new URL(request.url)
    const slug = url.searchParams.get("slug")

    if (!slug) {
      return json({ error: "missing slug" }, 400)
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

    const { results } = await env.DB.prepare(query)
      .bind(slug)
      .all()

    if (!results || results.length === 0) {
      return json({ error: "not found" }, 404)
    }

    const item = results[0]

    return json(item)

  } catch (err) {

    return json({
      error: "server_error",
      message: err.message
    }, 500)

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