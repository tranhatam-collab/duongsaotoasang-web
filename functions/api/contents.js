export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const visibility = (url.searchParams.get("visibility") || "public").trim();
  const type = (url.searchParams.get("type") || "").trim();
  const status = (url.searchParams.get("status") || "published").trim();
  const order = (url.searchParams.get("order") || "updated_at.desc").trim();

  let limit = parseInt(url.searchParams.get("limit") || "20", 10);
  if (!Number.isFinite(limit) || limit < 1) limit = 20;
  if (limit > 100) limit = 100;

  const orderMap = {
    "updated_at.desc": "updated_at DESC",
    "updated_at.asc": "updated_at ASC",
    "created_at.desc": "created_at DESC",
    "created_at.asc": "created_at ASC",
    "title_vi.asc": "title_vi ASC",
    "title_vi.desc": "title_vi DESC",
    "title_en.asc": "title_en ASC",
    "title_en.desc": "title_en DESC"
  };

  const orderSql = orderMap[order] || "updated_at DESC";

  let sql = `
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
    WHERE visibility = ?
      AND status = ?
  `;

  const binds = [visibility, status];

  if (type) {
    sql += ` AND type = ? `;
    binds.push(type);
  }

  sql += ` ORDER BY ${orderSql} LIMIT ? `;
  binds.push(limit);

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

    const stmt = env.DB.prepare(sql).bind(...binds);
    const result = await stmt.all();
    const items = Array.isArray(result?.results) ? result.results : [];

    return json({
      ok: true,
      items,
      meta: {
        visibility,
        type,
        status,
        order,
        limit,
        count: items.length
      }
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
