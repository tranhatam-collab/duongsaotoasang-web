export async function onRequest(context) {

  const { request, env } = context
  const url = new URL(request.url)

  const slug = (url.searchParams.get("slug") || "").trim()
  const lang = (url.searchParams.get("lang") || "vi") === "en" ? "en" : "vi"

  if (!slug) {
    return new Response(JSON.stringify({
      error: "Missing slug parameter"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    })
  }

  try {

    const stmt = env.DB.prepare(`
      SELECT
        id,
        slug,
        type,
        title,
        title_vi,
        title_en,
        excerpt,
        excerpt_vi,
        excerpt_en,
        content,
        content_vi,
        content_en,
        cover,
        cover_url,
        tags,
        created_at,
        updated_at
      FROM contents
      WHERE slug = ?
      LIMIT 1
    `).bind(slug)

    const { results } = await stmt.all()

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({
        error: "Content not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      })
    }

    const item = results[0]

    const title =
      lang === "en"
        ? (item.title_en || item.title || item.title_vi || "")
        : (item.title_vi || item.title || item.title_en || "")

    const excerpt =
      lang === "en"
        ? (item.excerpt_en || item.excerpt || item.excerpt_vi || "")
        : (item.excerpt_vi || item.excerpt || item.excerpt_en || "")

    const content =
      lang === "en"
        ? (item.content_en || item.content || item.content_vi || "")
        : (item.content_vi || item.content || item.content_en || "")

    const response = {
      id: item.id,
      slug: item.slug,
      type: item.type,

      title,
      title_vi: item.title_vi,
      title_en: item.title_en,

      excerpt,
      excerpt_vi: item.excerpt_vi,
      excerpt_en: item.excerpt_en,

      content,
      content_vi: item.content_vi,
      content_en: item.content_en,

      cover: item.cover || "",
      cover_url: item.cover_url || item.cover || "",

      tags: item.tags || "",

      created_at: item.created_at,
      updated_at: item.updated_at
    }

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
      }
    })

  } catch (error) {

    return new Response(JSON.stringify({
      error: "Database query failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })

  }

}
