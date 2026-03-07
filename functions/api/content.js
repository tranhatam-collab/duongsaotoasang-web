export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = (url.searchParams.get("slug") || "").trim();

  if (!slug) {
    return json(
      {
        ok: false,
        error: "Missing slug"
      },
      400
    );
  }

  try {
    if (!env.DB) {
      return json(
        {
          ok: false,
          error: "Missing D1 binding: DB"
        },
        500
      );
    }

    const stmt = env.DB.prepare(`
      SELECT
        id,
        slug,
        type,
        visibility,
        status,
        title_vi,
        title_en,
        excerpt_vi,
        excerpt_en,
        body_vi,
        body_en,
        cover_url,
        video_url,
        seo_title_vi,
        seo_title_en,
        seo_desc_vi,
        seo_desc_en,
        created_at,
        updated_at
      FROM contents
      WHERE slug = ?
        AND visibility = 'public'
        AND status = 'published'
      LIMIT 1
    `).bind(slug);

    const row = await stmt.first();

    if (!row) {
      return json({
        ok: true,
        item: null
      });
    }

    return json({
      ok: true,
      item: row
    });
  } catch (err) {
    return json(
      {
        ok: false,
        error: String(err?.message || err)
      },
      500
    );
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": status === 200 ? "public, max-age=60" : "no-store"
    }
  });
}
