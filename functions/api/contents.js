const FALLBACK_CONTENTS = [
  {
    id: 1,
    slug: "about",
    type: "page",
    title_vi: "Giới thiệu Đường Sao Tỏa Sáng",
    title_en: "About Đường Sao Tỏa Sáng",
    excerpt_vi: "Đường Sao Tỏa Sáng là một thư viện tri thức sống và một nền tảng nội dung công khai.",
    excerpt_en: "Đường Sao Tỏa Sáng is a living knowledge library and a public publishing platform.",
    cover: "",
    cover_url: "",
    tags: "giới thiệu,hệ thống",
    published: 1,
    created_at: "2026-03-01T08:00:00.000Z",
    updated_at: "2026-03-01T08:00:00.000Z"
  },
  {
    id: 2,
    slug: "contact",
    type: "page",
    title_vi: "Liên hệ",
    title_en: "Contact",
    excerpt_vi: "Kênh liên hệ chính thức của hệ thống.",
    excerpt_en: "Official contact channels.",
    cover: "",
    cover_url: "",
    tags: "liên hệ",
    published: 1,
    created_at: "2026-03-01T08:00:00.000Z",
    updated_at: "2026-03-01T08:00:00.000Z"
  },
  {
    id: 3,
    slug: "program",
    type: "page",
    title_vi: "Chương trình",
    title_en: "Program",
    excerpt_vi: "Tổng quan các trục triển khai nội dung, cộng đồng, hệ thống bài viết và các hướng mở rộng dài hạn.",
    excerpt_en: "Overview of content, community, writing systems, and long-term expansion directions.",
    cover: "",
    cover_url: "",
    tags: "chương trình",
    published: 1,
    created_at: "2026-03-01T08:00:00.000Z",
    updated_at: "2026-03-01T08:00:00.000Z"
  },
  {
    id: 4,
    slug: "hanh-trinh-nhin-lai-chinh-minh",
    type: "post",
    title_vi: "Hành trình nhìn lại chính mình trong một thế giới quá ồn",
    title_en: "Looking back at yourself in an overly noisy world",
    excerpt_vi: "Có những giai đoạn con người không thiếu thông tin, mà thiếu sự lắng lại đủ sâu để nhận ra mình đang đi về đâu.",
    excerpt_en: "There are times when people do not lack information, but lack enough stillness to see where they are heading.",
    cover: "",
    cover_url: "",
    tags: "nhận thức,hành trình",
    published: 1,
    created_at: "2026-03-01T08:00:00.000Z",
    updated_at: "2026-03-01T08:00:00.000Z"
  },
  {
    id: 5,
    slug: "sang-tao-khong-bat-dau-tu-tham-vong",
    type: "post",
    title_vi: "Sáng tạo không bắt đầu từ tham vọng mà từ sự thấy rõ",
    title_en: "Creativity does not begin with ambition but with clarity",
    excerpt_vi: "Điều tạo nên giá trị bền vững không phải là làm cho thật nhiều, mà là tạo ra đúng thứ cần được sinh ra.",
    excerpt_en: "What creates lasting value is not doing more, but bringing forth what truly needs to exist.",
    cover: "",
    cover_url: "",
    tags: "sáng tạo,nhận thức",
    published: 1,
    created_at: "2026-02-26T08:00:00.000Z",
    updated_at: "2026-02-26T08:00:00.000Z"
  },
  {
    id: 6,
    slug: "cong-dong-khong-phai-dam-dong",
    type: "post",
    title_vi: "Cộng đồng không phải đám đông, mà là những người cùng giữ một hướng đi",
    title_en: "Community is not a crowd, but people holding the same direction",
    excerpt_vi: "Một cộng đồng đúng không được xây bằng tiếng ồn, mà bằng sự tin cậy, trách nhiệm và khả năng cùng đi xa.",
    excerpt_en: "A true community is not built by noise, but by trust, responsibility, and the capacity to travel far together.",
    cover: "",
    cover_url: "",
    tags: "cộng đồng",
    published: 1,
    created_at: "2026-02-20T08:00:00.000Z",
    updated_at: "2026-02-20T08:00:00.000Z"
  },
  {
    id: 7,
    slug: "mot-doi-song-khong-bi-pha-tan-boi-xa-hoi",
    type: "post",
    title_vi: "Một đời sống không bị phân tán bởi xã hội cần được xây thế nào",
    title_en: "How to build a life not scattered by society",
    excerpt_vi: "Khi không tự thiết kế đời sống của mình, con người sẽ bị kéo vào chương trình của người khác mà không hề nhận ra.",
    excerpt_en: "When you do not design your own life, you get pulled into someone else's program without noticing.",
    cover: "",
    cover_url: "",
    tags: "nhận thức,định hướng",
    published: 1,
    created_at: "2026-02-14T08:00:00.000Z",
    updated_at: "2026-02-14T08:00:00.000Z"
  },
  {
    id: 8,
    slug: "doc-cham-de-song-sau",
    type: "post",
    title_vi: "Đọc chậm để sống sâu hơn trong thời đại đọc lướt",
    title_en: "Read slowly to live more deeply in an age of skimming",
    excerpt_vi: "Một bài viết tốt không chỉ cung cấp thông tin, mà mở ra một không gian để người đọc tự gặp lại chính mình.",
    excerpt_en: "A strong piece of writing does not only provide information, but opens a space for the reader to meet themselves again.",
    cover: "",
    cover_url: "",
    tags: "hành trình,nhận thức",
    published: 1,
    created_at: "2026-02-10T08:00:00.000Z",
    updated_at: "2026-02-10T08:00:00.000Z"
  },
  {
    id: 9,
    slug: "khoi-nghiep-tu-noi-song-that",
    type: "post",
    title_vi: "Khởi nghiệp từ nơi sống thật thay vì từ nỗi sợ phải chứng minh",
    title_en: "Building from real living instead of the fear of proving yourself",
    excerpt_vi: "Nếu bắt đầu chỉ để chứng minh mình hơn người khác, ta sẽ rất nhanh kiệt sức trước khi đi đến giá trị thật.",
    excerpt_en: "If you begin only to prove yourself against others, exhaustion arrives long before true value does.",
    cover: "",
    cover_url: "",
    tags: "sáng tạo,hành trình",
    published: 1,
    created_at: "2026-02-06T08:00:00.000Z",
    updated_at: "2026-02-06T08:00:00.000Z"
  },
  {
    id: 10,
    slug: "vi-sao-con-nguoi-mat-phuong-huong",
    type: "post",
    title_vi: "Vì sao con người mất phương hướng dù có quá nhiều lựa chọn",
    title_en: "Why people lose direction even with too many choices",
    excerpt_vi: "Sự phong phú bên ngoài không thể thay thế cho một la bàn bên trong. Không có hướng đi, lựa chọn càng nhiều càng dễ mệt.",
    excerpt_en: "Outer abundance cannot replace an inner compass. Without direction, more choices often mean more exhaustion.",
    cover: "",
    cover_url: "",
    tags: "nhận thức",
    published: 1,
    created_at: "2026-01-28T08:00:00.000Z",
    updated_at: "2026-01-28T08:00:00.000Z"
  },
  {
    id: 11,
    slug: "duong-di-cua-nhung-nguoi-muon-song-khac",
    type: "post",
    title_vi: "Đường đi của những người muốn sống khác nhưng chưa biết bắt đầu từ đâu",
    title_en: "The path for those who want to live differently but do not know where to begin",
    excerpt_vi: "Điểm bắt đầu không nằm ở việc đổi hết mọi thứ ngay lập tức, mà ở việc nhìn ra đâu là điều cần giữ và đâu là điều cần dừng.",
    excerpt_en: "The beginning is not changing everything at once, but seeing clearly what must be kept and what must stop.",
    cover: "",
    cover_url: "",
    tags: "hành trình,định hướng",
    published: 1,
    created_at: "2026-01-22T08:00:00.000Z",
    updated_at: "2026-01-22T08:00:00.000Z"
  }
];

function normalizeLang(value) {
  return value === "en" ? "en" : "vi";
}

function parseLimit(value, fallback = 24, max = 100) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(n, max);
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function pickListingFields(item, lang) {
  return {
    id: item.id,
    slug: item.slug || "",
    type: item.type || "post",
    title: lang === "en"
      ? (item.title_en || item.title || item.title_vi || "")
      : (item.title_vi || item.title || item.title_en || ""),
    title_vi: item.title_vi || item.title || "",
    title_en: item.title_en || item.title || "",
    excerpt: lang === "en"
      ? (item.excerpt_en || item.excerpt || item.excerpt_vi || "")
      : (item.excerpt_vi || item.excerpt || item.excerpt_en || ""),
    excerpt_vi: item.excerpt_vi || item.excerpt || "",
    excerpt_en: item.excerpt_en || item.excerpt || "",
    cover: item.cover || "",
    cover_url: item.cover_url || item.cover || "",
    tags: item.tags || "",
    created_at: item.created_at || "",
    updated_at: item.updated_at || ""
  };
}

function filterFallbackData(items, { q = "", type = "", limit = 24, lang = "vi" } = {}) {
  let result = [...items];

  if (type) {
    result = result.filter((item) => String(item.type || "") === String(type));
  }

  if (q) {
    const keyword = normalizeText(q);
    result = result.filter((item) => {
      const haystack = normalizeText([
        item.slug,
        item.title_vi,
        item.title_en,
        item.excerpt_vi,
        item.excerpt_en,
        item.tags
      ].join(" "));
      return haystack.includes(keyword);
    });
  }

  result.sort((a, b) => {
    const da = new Date(a.created_at || 0).getTime();
    const db = new Date(b.created_at || 0).getTime();
    return db - da;
  });

  return result
    .slice(0, limit)
    .map((item) => pickListingFields(item, lang));
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300"
    }
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const lang = normalizeLang(url.searchParams.get("lang"));
  const limit = parseLimit(url.searchParams.get("limit"), 24, 100);
  const type = (url.searchParams.get("type") || "").trim();
  const q = (url.searchParams.get("q") || "").trim();

  if (!env?.DB) {
    return json(filterFallbackData(FALLBACK_CONTENTS, { q, type, limit, lang }));
  }

  try {
    let query = `
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
        published,
        created_at,
        updated_at
      FROM contents
      WHERE COALESCE(published, 1) = 1
    `;

    const bindings = [];

    if (type) {
      query += ` AND type = ?`;
      bindings.push(type);
    }

    if (q) {
      query += `
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
      `;
      const like = `%${q}%`;
      bindings.push(
        like, like, like, like, like, like, like, like
      );
    }

    query += ` ORDER BY datetime(created_at) DESC LIMIT ?`;
    bindings.push(limit);

    const stmt = env.DB.prepare(query).bind(...bindings);
    const { results } = await stmt.all();

    if (Array.isArray(results) && results.length) {
      return json(results.map((item) => pickListingFields(item, lang)));
    }

    return json(filterFallbackData(FALLBACK_CONTENTS, { q, type, limit, lang }));
  } catch (_error) {
    return json(filterFallbackData(FALLBACK_CONTENTS, { q, type, limit, lang }));
  }
}
