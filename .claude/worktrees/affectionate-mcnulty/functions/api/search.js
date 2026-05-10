export async function onRequest(context) {

  const { request, env } = context
  const url = new URL(request.url)

  const q = (url.searchParams.get("q") || "").trim()
  const lang = (url.searchParams.get("lang") || "vi") === "en" ? "en" : "vi"
  const limitRaw = parseInt(url.searchParams.get("limit") || "20", 10)
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 20

  if (!q) {
    return new Response(JSON.stringify([]), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=120"
      }
    })
  }

  try {

    const like = `%${q}%`

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
        cover,
        cover_url,
        tags,
        created_at,
        updated_at
      FROM contents
      WHERE published = 1
        AND (
          slug LIKE ?
          OR title LIKE ?
          OR title_vi LIKE ?
          OR title_en LIKE ?
          OR excerpt LIKE ?
          OR excerpt_vi LIKE ?
          OR excerpt_en LIKE ?
          OR tags LIKE ?
        )
      ORDER BY datetime(created_at) DESC
      LIMIT ?
    `).bind(
      like,
      like,
      like,
      like,
      like,
      like,
      like,
      like,
      limit
    )

    const { results } = await stmt.all()

    const data = (results || []).map(item => {
      return {
        id: item.id,
        slug: item.slug,
        type: item.type,

        title:
          lang === "en"
            ? (item.title_en || item.title || item.title_vi || "")
            : (item.title_vi || item.title || item.title_en || ""),

        title_vi: item.title_vi || item.title || "",
        title_en: item.title_en || item.title || "",

        excerpt:
          lang === "en"
            ? (item.excerpt_en || item.excerpt || item.excerpt_vi || "")
            : (item.excerpt_vi || item.excerpt || item.excerpt_en || ""),

        excerpt_vi: item.excerpt_vi || item.excerpt || "",
        excerpt_en: item.excerpt_en || item.excerpt || "",

        cover: item.cover || "",
        cover_url: item.cover_url || item.cover || "",
        tags: item.tags || "",

        created_at: item.created_at,
        updated_at: item.updated_at
      }
    })

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=120"
      }
    })

  } catch (error) {

    return new Response(JSON.stringify({
      error: "Search query failed"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    })

  }

}
