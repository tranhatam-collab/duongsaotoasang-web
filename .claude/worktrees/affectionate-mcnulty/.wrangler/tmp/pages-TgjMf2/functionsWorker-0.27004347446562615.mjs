var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/content.js
var onRequestGet = /* @__PURE__ */ __name(async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    if (!slug) {
      return json({ error: "missing slug" }, 400);
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
    `;
    const { results } = await env.DB.prepare(query).bind(slug).all();
    if (!results || results.length === 0) {
      return json({ error: "not found" }, 404);
    }
    const item = results[0];
    return json(item);
  } catch (err) {
    return json({
      error: "server_error",
      message: err.message
    }, 500);
  }
}, "onRequestGet");
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}
__name(json, "json");

// api/contents.js
var FALLBACK_CONTENTS = [
  {
    slug: "hanh-trinh-nhin-lai-chinh-minh",
    type: "post",
    title_vi: "H\xE0nh tr\xECnh nh\xECn l\u1EA1i ch\xEDnh m\xECnh trong m\u1ED9t th\u1EBF gi\u1EDBi qu\xE1 \u1ED3n",
    title_en: "Looking back at yourself in an overly noisy world",
    excerpt_vi: "C\xF3 nh\u1EEFng giai \u0111o\u1EA1n con ng\u01B0\u1EDDi kh\xF4ng thi\u1EBFu th\xF4ng tin, m\xE0 thi\u1EBFu s\u1EF1 l\u1EAFng l\u1EA1i \u0111\u1EE7 s\xE2u \u0111\u1EC3 nh\u1EADn ra m\xECnh \u0111ang \u0111i v\u1EC1 \u0111\xE2u.",
    excerpt_en: "There are times when people do not lack information, but lack enough stillness to see where they are heading.",
    content_vi: "<p>C\xF3 nh\u1EEFng th\u1EDDi \u0111i\u1EC3m con ng\u01B0\u1EDDi s\u1ED1ng gi\u1EEFa qu\xE1 nhi\u1EC1u t\xEDn hi\u1EC7u, qu\xE1 nhi\u1EC1u l\u1EDDi m\u1EDDi g\u1ECDi v\xE0 qu\xE1 nhi\u1EC1u ti\u1EBFng \u1ED3n \u0111\u1EBFn t\u1EEB b\xEAn ngo\xE0i.</p><p>Khi nh\u1ECBp s\u1ED1ng tr\u1EDF n\xEAn qu\xE1 d\xE0y \u0111\u1EB7c, con ng\u01B0\u1EDDi r\u1EA5t d\u1EC5 nh\u1EA7m c\u1EA3m gi\xE1c b\u1EADn r\u1ED9n v\u1EDBi c\u1EA3m gi\xE1c s\u1ED1ng c\xF3 \xFD ngh\u0129a.</p>",
    content_en: "<p>There are moments when people live among too many signals, too many invitations, and too much noise coming from the outside world.</p><p>When life becomes too dense, people easily confuse busyness with meaning.</p>",
    tags: "nh\u1EADn th\u1EE9c,h\xE0nh tr\xECnh",
    cover_url: "",
    created_at: "2026-03-01T08:00:00.000Z"
  },
  {
    slug: "sang-tao-khong-bat-dau-tu-tham-vong",
    type: "post",
    title_vi: "S\xE1ng t\u1EA1o kh\xF4ng b\u1EAFt \u0111\u1EA7u t\u1EEB tham v\u1ECDng m\xE0 t\u1EEB s\u1EF1 th\u1EA5y r\xF5",
    title_en: "Creativity does not begin with ambition but with clarity",
    excerpt_vi: "\u0110i\u1EC1u t\u1EA1o n\xEAn gi\xE1 tr\u1ECB b\u1EC1n v\u1EEFng kh\xF4ng ph\u1EA3i l\xE0 l\xE0m cho th\u1EADt nhi\u1EC1u, m\xE0 l\xE0 t\u1EA1o ra \u0111\xFAng th\u1EE9 c\u1EA7n \u0111\u01B0\u1EE3c sinh ra.",
    excerpt_en: "What creates lasting value is not doing more, but bringing forth what truly needs to exist.",
    content_vi: "<p>Nhi\u1EC1u ng\u01B0\u1EDDi ngh\u0129 s\xE1ng t\u1EA1o l\xE0 ph\u1EA3i m\u1EDBi, ph\u1EA3i kh\xE1c, ph\u1EA3i g\xE2y \u1EA5n t\u01B0\u1EE3ng th\u1EADt m\u1EA1nh.</p><p>S\xE1ng t\u1EA1o b\u1EC1n v\u1EEFng b\u1EAFt \u0111\u1EA7u khi con ng\u01B0\u1EDDi th\u1EA5y r\xF5 m\u1ED9t nhu c\u1EA7u th\u1EADt.</p>",
    content_en: "<p>Many people think creativity must be new, different, and highly impressive.</p><p>Sustainable creativity begins when a person clearly sees a real need.</p>",
    tags: "s\xE1ng t\u1EA1o,nh\u1EADn th\u1EE9c",
    cover_url: "",
    created_at: "2026-02-26T08:00:00.000Z"
  },
  {
    slug: "cong-dong-khong-phai-dam-dong",
    type: "post",
    title_vi: "C\u1ED9ng \u0111\u1ED3ng kh\xF4ng ph\u1EA3i \u0111\xE1m \u0111\xF4ng, m\xE0 l\xE0 nh\u1EEFng ng\u01B0\u1EDDi c\xF9ng gi\u1EEF m\u1ED9t h\u01B0\u1EDBng \u0111i",
    title_en: "Community is not a crowd, but people holding the same direction",
    excerpt_vi: "M\u1ED9t c\u1ED9ng \u0111\u1ED3ng \u0111\xFAng kh\xF4ng \u0111\u01B0\u1EE3c x\xE2y b\u1EB1ng ti\u1EBFng \u1ED3n, m\xE0 b\u1EB1ng s\u1EF1 tin c\u1EADy, tr\xE1ch nhi\u1EC7m v\xE0 kh\u1EA3 n\u0103ng c\xF9ng \u0111i xa.",
    excerpt_en: "A true community is not built by noise, but by trust, responsibility, and the capacity to travel far together.",
    content_vi: "<p>Nhi\u1EC1u n\u01A1i t\u1EF1 g\u1ECDi m\xECnh l\xE0 c\u1ED9ng \u0111\u1ED3ng ch\u1EC9 v\xEC c\xF3 nhi\u1EC1u ng\u01B0\u1EDDi xu\u1EA5t hi\u1EC7n c\xF9ng l\xFAc.</p><p>C\u1ED9ng \u0111\u1ED3ng ch\u1EC9 b\u1EAFt \u0111\u1EA7u khi c\xF3 gi\xE1 tr\u1ECB chung.</p>",
    content_en: "<p>Many places call themselves a community simply because many people appear at once.</p><p>Community begins only when shared values exist.</p>",
    tags: "c\u1ED9ng \u0111\u1ED3ng",
    cover_url: "",
    created_at: "2026-02-20T08:00:00.000Z"
  },
  {
    slug: "mot-doi-song-khong-bi-pha-tan-boi-xa-hoi",
    type: "post",
    title_vi: "M\u1ED9t \u0111\u1EDDi s\u1ED1ng kh\xF4ng b\u1ECB ph\xE2n t\xE1n b\u1EDFi x\xE3 h\u1ED9i c\u1EA7n \u0111\u01B0\u1EE3c x\xE2y th\u1EBF n\xE0o",
    title_en: "How to build a life not scattered by society",
    excerpt_vi: "Khi kh\xF4ng t\u1EF1 thi\u1EBFt k\u1EBF \u0111\u1EDDi s\u1ED1ng c\u1EE7a m\xECnh, con ng\u01B0\u1EDDi s\u1EBD b\u1ECB k\xE9o v\xE0o ch\u01B0\u01A1ng tr\xECnh c\u1EE7a ng\u01B0\u1EDDi kh\xE1c m\xE0 kh\xF4ng h\u1EC1 nh\u1EADn ra.",
    excerpt_en: "When you do not design your own life, you get pulled into someone else's program without noticing.",
    content_vi: "<p>Cu\u1ED9c s\u1ED1ng hi\u1EC7n \u0111\u1EA1i \u0111\u1EA7y nh\u1EEFng l\u1EDDi m\u1EDDi g\u1ECDi. L\xE0m nhi\u1EC1u h\u01A1n, ki\u1EBFm nhi\u1EC1u h\u01A1n, theo k\u1ECBp nhi\u1EC1u h\u01A1n.</p>",
    content_en: "<p>Modern life is full of invitations. Do more, earn more, keep up with more.</p>",
    tags: "nh\u1EADn th\u1EE9c,\u0111\u1ECBnh h\u01B0\u1EDBng",
    cover_url: "",
    created_at: "2026-02-14T08:00:00.000Z"
  },
  {
    slug: "doc-cham-de-song-sau",
    type: "post",
    title_vi: "\u0110\u1ECDc ch\u1EADm \u0111\u1EC3 s\u1ED1ng s\xE2u h\u01A1n trong th\u1EDDi \u0111\u1EA1i \u0111\u1ECDc l\u01B0\u1EDBt",
    title_en: "Read slowly to live more deeply in an age of skimming",
    excerpt_vi: "M\u1ED9t b\xE0i vi\u1EBFt t\u1ED1t kh\xF4ng ch\u1EC9 cung c\u1EA5p th\xF4ng tin, m\xE0 m\u1EDF ra m\u1ED9t kh\xF4ng gian \u0111\u1EC3 ng\u01B0\u1EDDi \u0111\u1ECDc t\u1EF1 g\u1EB7p l\u1EA1i ch\xEDnh m\xECnh.",
    excerpt_en: "A strong piece of writing does not only provide information, but opens a space for the reader to meet themselves again.",
    content_vi: "<p>Trong th\u1EDDi \u0111\u1EA1i m\xE0 m\u1ECDi th\u1EE9 \u0111\u01B0\u1EE3c t\u1ED1i \u01B0u cho t\u1ED1c \u0111\u1ED9, vi\u1EC7c \u0111\u1ECDc c\u0169ng b\u1ECB cu\u1ED1n v\xE0o nh\u1ECBp \u0111\u1ECDc l\u01B0\u1EDBt.</p>",
    content_en: "<p>In an age where everything is optimized for speed, reading too has been pulled into the rhythm of skimming.</p>",
    tags: "h\xE0nh tr\xECnh,nh\u1EADn th\u1EE9c",
    cover_url: "",
    created_at: "2026-02-10T08:00:00.000Z"
  },
  {
    slug: "khoi-nghiep-tu-noi-song-that",
    type: "post",
    title_vi: "Kh\u1EDFi nghi\u1EC7p t\u1EEB n\u01A1i s\u1ED1ng th\u1EADt thay v\xEC t\u1EEB n\u1ED7i s\u1EE3 ph\u1EA3i ch\u1EE9ng minh",
    title_en: "Building from real living instead of the fear of proving yourself",
    excerpt_vi: "N\u1EBFu b\u1EAFt \u0111\u1EA7u ch\u1EC9 \u0111\u1EC3 ch\u1EE9ng minh m\xECnh h\u01A1n ng\u01B0\u1EDDi kh\xE1c, ta s\u1EBD r\u1EA5t nhanh ki\u1EC7t s\u1EE9c tr\u01B0\u1EDBc khi \u0111i \u0111\u1EBFn gi\xE1 tr\u1ECB th\u1EADt.",
    excerpt_en: "If you begin only to prove yourself against others, exhaustion arrives long before true value does.",
    content_vi: "<p>Nhi\u1EC1u d\u1EF1 \xE1n kh\u1EDFi \u0111\u1EA7u r\u1EA5t m\u1EA1nh v\xEC \u0111\u01B0\u1EE3c \u0111\u1EA9y b\u1EB1ng n\u0103ng l\u01B0\u1EE3ng ch\u1EE9ng minh.</p>",
    content_en: "<p>Many ventures start with powerful energy because they are fueled by the need to prove something.</p>",
    tags: "s\xE1ng t\u1EA1o,h\xE0nh tr\xECnh",
    cover_url: "",
    created_at: "2026-02-06T08:00:00.000Z"
  },
  {
    slug: "about",
    type: "page",
    title_vi: "Gi\u1EDBi thi\u1EC7u \u0110\u01B0\u1EDDng Sao T\u1ECFa S\xE1ng",
    title_en: "About \u0110\u01B0\u1EDDng Sao T\u1ECFa S\xE1ng",
    excerpt_vi: "T\u1EA7m nh\xECn, s\u1EE9 m\u1EC7nh v\xE0 \u0111\u1ECBnh h\u01B0\u1EDBng ph\xE1t tri\u1EC3n c\u1EE7a n\u1EC1n t\u1EA3ng \u0110\u01B0\u1EDDng Sao T\u1ECFa S\xE1ng.",
    excerpt_en: "Vision, mission, and development direction of \u0110\u01B0\u1EDDng Sao T\u1ECFa S\xE1ng.",
    content_vi: "<p>\u0110\u01B0\u1EDDng Sao T\u1ECFa S\xE1ng l\xE0 n\u1EC1n t\u1EA3ng tri th\u1EE9c, ch\u01B0\u01A1ng tr\xECnh v\xE0 c\u1ED9ng \u0111\u1ED3ng d\xE0nh cho h\xE0nh tr\xECnh t\u1ECFa s\xE1ng c\u1EE7a ng\u01B0\u1EDDi Vi\u1EC7t tr\xEAn to\xE0n c\u1EA7u.</p>",
    content_en: "<p>\u0110\u01B0\u1EDDng Sao T\u1ECFa S\xE1ng is a knowledge, program, and community platform for the shining journey of Vietnamese people worldwide.</p>",
    tags: "gi\u1EDBi thi\u1EC7u,h\u1EC7 th\u1ED1ng",
    cover_url: "",
    created_at: "2026-03-01T08:00:00.000Z"
  },
  {
    slug: "program",
    type: "page",
    title_vi: "Ch\u01B0\u01A1ng tr\xECnh \u0110\u01B0\u1EDDng Sao T\u1ECFa S\xE1ng",
    title_en: "Programs of \u0110\u01B0\u1EDDng Sao T\u1ECFa S\xE1ng",
    excerpt_vi: "T\u1ED5ng quan c\xE1c chu\u1ED7i ch\u01B0\u01A1ng tr\xECnh ngh\u1EC7 thu\u1EADt, gi\xE1o d\u1EE5c, c\u1ED9ng \u0111\u1ED3ng v\xE0 tri th\u1EE9c.",
    excerpt_en: "Overview of artistic, educational, community, and knowledge program series.",
    content_vi: "<p>DSTS ph\xE1t tri\u1EC3n c\xE1c ch\u01B0\u01A1ng tr\xECnh d\xE0nh cho ngh\u1EC7 s\u0129, doanh nh\xE2n, t\xE0i n\u0103ng Vi\u1EC7t to\xE0n c\u1EA7u v\xE0 c\u1ED9ng \u0111\u1ED3ng ng\u01B0\u1EDDi Vi\u1EC7t mu\xF4n n\u01A1i.</p>",
    content_en: "<p>DSTS develops programs for artists, entrepreneurs, global Vietnamese talents, and the Vietnamese worldwide community.</p>",
    tags: "ch\u01B0\u01A1ng tr\xECnh,c\u1ED9ng \u0111\u1ED3ng",
    cover_url: "",
    created_at: "2026-03-01T08:00:00.000Z"
  }
];
var onRequestGet2 = /* @__PURE__ */ __name(async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const lang = normalizeLang(url.searchParams.get("lang"));
    const type = (url.searchParams.get("type") || "").trim();
    const limit = parseLimit(url.searchParams.get("limit"), 24, 100);
    const q = (url.searchParams.get("q") || "").trim();
    if (!env.DB) {
      const fallback = selectFallback({ type, limit, q, lang });
      return json2(fallback);
    }
    const queryParts = [];
    const bindings = [];
    queryParts.push(`
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
      WHERE 1 = 1
    `);
    if (type) {
      queryParts.push(`AND type = ?`);
      bindings.push(type);
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
      `);
      const like = `%${q}%`;
      bindings.push(like, like, like, like, like, like, like, like);
    }
    queryParts.push(`ORDER BY datetime(created_at) DESC LIMIT ?`);
    bindings.push(limit);
    const sql = queryParts.join("\n");
    const stmt = env.DB.prepare(sql).bind(...bindings);
    const result = await stmt.all();
    const rows = Array.isArray(result.results) ? result.results : [];
    if (!rows.length) {
      const fallback = selectFallback({ type, limit, q, lang });
      return json2(fallback);
    }
    return json2(rows.map((item) => localizeItem(item, lang)));
  } catch (error) {
    const url = new URL(request.url);
    const lang = normalizeLang(url.searchParams.get("lang"));
    const type = (url.searchParams.get("type") || "").trim();
    const limit = parseLimit(url.searchParams.get("limit"), 24, 100);
    const q = (url.searchParams.get("q") || "").trim();
    const fallback = selectFallback({ type, limit, q, lang });
    return json2(fallback);
  }
}, "onRequestGet");
function normalizeLang(value) {
  return value === "en" ? "en" : "vi";
}
__name(normalizeLang, "normalizeLang");
function parseLimit(value, fallback = 24, max = 100) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(n, max);
}
__name(parseLimit, "parseLimit");
function normalizeText(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
__name(normalizeText, "normalizeText");
function localizeItem(item, lang) {
  return {
    ...item,
    title: lang === "en" ? item.title_en || item.title_vi || "" : item.title_vi || item.title_en || "",
    excerpt: lang === "en" ? item.excerpt_en || item.excerpt_vi || "" : item.excerpt_vi || item.excerpt_en || "",
    content: lang === "en" ? item.content_en || item.content_vi || "" : item.content_vi || item.content_en || ""
  };
}
__name(localizeItem, "localizeItem");
function selectFallback({ type = "", limit = 24, q = "", lang = "vi" }) {
  let list = [...FALLBACK_CONTENTS];
  if (type) {
    list = list.filter((item) => item.type === type);
  }
  if (q) {
    const keyword = normalizeText(q);
    list = list.filter((item) => {
      const haystack = normalizeText([
        item.slug,
        item.title_vi,
        item.title_en,
        item.excerpt_vi,
        item.excerpt_en,
        item.content_vi,
        item.content_en,
        item.tags
      ].join(" "));
      return haystack.includes(keyword);
    });
  }
  list.sort((a, b) => {
    const da = new Date(a.created_at || 0).getTime();
    const db = new Date(b.created_at || 0).getTime();
    return db - da;
  });
  return list.slice(0, limit).map((item) => localizeItem(item, lang));
}
__name(selectFallback, "selectFallback");
function json2(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}
__name(json2, "json");

// api/search.js
async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  const lang = (url.searchParams.get("lang") || "vi") === "en" ? "en" : "vi";
  const limitRaw = parseInt(url.searchParams.get("limit") || "20", 10);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 20;
  if (!q) {
    return new Response(JSON.stringify([]), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=120"
      }
    });
  }
  try {
    const like = `%${q}%`;
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
    );
    const { results } = await stmt.all();
    const data = (results || []).map((item) => {
      return {
        id: item.id,
        slug: item.slug,
        type: item.type,
        title: lang === "en" ? item.title_en || item.title || item.title_vi || "" : item.title_vi || item.title || item.title_en || "",
        title_vi: item.title_vi || item.title || "",
        title_en: item.title_en || item.title || "",
        excerpt: lang === "en" ? item.excerpt_en || item.excerpt || item.excerpt_vi || "" : item.excerpt_vi || item.excerpt || item.excerpt_en || "",
        excerpt_vi: item.excerpt_vi || item.excerpt || "",
        excerpt_en: item.excerpt_en || item.excerpt || "",
        cover: item.cover || "",
        cover_url: item.cover_url || item.cover || "",
        tags: item.tags || "",
        created_at: item.created_at,
        updated_at: item.updated_at
      };
    });
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=120"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Search query failed"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
__name(onRequest, "onRequest");

// rss.xml.js
async function onRequestGet3(context) {
  const { env } = context;
  const stmt = env.DB.prepare(`
    SELECT slug, type, title_vi, title_en, excerpt_vi, excerpt_en, updated_at
    FROM contents
    WHERE visibility = 'public'
      AND status = 'published'
      AND type = 'post'
    ORDER BY updated_at DESC
    LIMIT 50
  `);
  const { results = [] } = await stmt.all();
  const items = results.map((row) => `
    <item>
      <title><![CDATA[${row.title_vi || row.title_en || row.slug}]]></title>
      <link>https://duongsaotoasang.com/posts/${row.slug}</link>
      <guid>https://duongsaotoasang.com/posts/${row.slug}</guid>
      <description><![CDATA[${row.excerpt_vi || row.excerpt_en || ""}]]></description>
      <pubDate>${new Date(row.updated_at).toUTCString()}</pubDate>
    </item>
  `).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>\u0110\u01B0\u1EDDng Sao T\u1ECFa S\xE1ng</title>
      <link>https://duongsaotoasang.com/</link>
      <description>N\u1ED9i dung c\xF4ng khai t\u1EEB \u0110\u01B0\u1EDDng Sao T\u1ECFa S\xE1ng</description>
      ${items}
    </channel>
  </rss>`;
  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8"
    }
  });
}
__name(onRequestGet3, "onRequestGet");

// sitemap.xml.js
async function onRequestGet4(context) {
  const { env } = context;
  const staticUrls = [
    "/",
    "/about",
    "/program",
    "/events",
    "/scripts",
    "/donate",
    "/transparency",
    "/legal",
    "/contact",
    "/posts"
  ];
  const stmt = env.DB.prepare(`
    SELECT slug, type, updated_at
    FROM contents
    WHERE visibility = 'public'
      AND status = 'published'
  `);
  const { results = [] } = await stmt.all();
  const staticXml = staticUrls.map((url) => `
    <url>
      <loc>https://duongsaotoasang.com${url}</loc>
    </url>
  `).join("");
  const dynamicXml = results.map((row) => {
    const loc = row.type === "post" ? `https://duongsaotoasang.com/posts/${row.slug}` : `https://duongsaotoasang.com/${row.slug}`;
    return `
      <url>
        <loc>${loc}</loc>
        <lastmod>${new Date(row.updated_at).toISOString()}</lastmod>
      </url>
    `;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticXml}
    ${dynamicXml}
  </urlset>`;
  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
}
__name(onRequestGet4, "onRequestGet");

// ../.wrangler/tmp/pages-TgjMf2/functionsRoutes-0.9357475106557399.mjs
var routes = [
  {
    routePath: "/api/content",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/contents",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/search",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/rss.xml",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/sitemap.xml",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  }
];

// ../../../../../.npm-global/lib/node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../../../.npm-global/lib/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../../../../../.npm-global/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../.npm-global/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-6UzXhi/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../../../../../.npm-global/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-6UzXhi/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.27004347446562615.mjs.map
