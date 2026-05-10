// FILE: /functions/api/contents.js

const FALLBACK_CONTENTS = [
  {
    slug: "hanh-trinh-nhin-lai-chinh-minh",
    type: "post",
    title_vi: "Hành trình nhìn lại chính mình trong một thế giới quá ồn",
    title_en: "Looking back at yourself in an overly noisy world",
    excerpt_vi: "Có những giai đoạn con người không thiếu thông tin, mà thiếu sự lắng lại đủ sâu để nhận ra mình đang đi về đâu.",
    excerpt_en: "There are times when people do not lack information, but lack enough stillness to see where they are heading.",
    content_vi: "<p>Có những thời điểm con người sống giữa quá nhiều tín hiệu, quá nhiều lời mời gọi và quá nhiều tiếng ồn đến từ bên ngoài.</p><p>Khi nhịp sống trở nên quá dày đặc, con người rất dễ nhầm cảm giác bận rộn với cảm giác sống có ý nghĩa.</p>",
    content_en: "<p>There are moments when people live among too many signals, too many invitations, and too much noise coming from the outside world.</p><p>When life becomes too dense, people easily confuse busyness with meaning.</p>",
    tags: "nhận thức,hành trình",
    cover_url: "",
    created_at: "2026-03-01T08:00:00.000Z"
  },
  {
    slug: "sang-tao-khong-bat-dau-tu-tham-vong",
    type: "post",
    title_vi: "Sáng tạo không bắt đầu từ tham vọng mà từ sự thấy rõ",
    title_en: "Creativity does not begin with ambition but with clarity",
    excerpt_vi: "Điều tạo nên giá trị bền vững không phải là làm cho thật nhiều, mà là tạo ra đúng thứ cần được sinh ra.",
    excerpt_en: "What creates lasting value is not doing more, but bringing forth what truly needs to exist.",
    content_vi: "<p>Nhiều người nghĩ sáng tạo là phải mới, phải khác, phải gây ấn tượng thật mạnh.</p><p>Sáng tạo bền vững bắt đầu khi con người thấy rõ một nhu cầu thật.</p>",
    content_en: "<p>Many people think creativity must be new, different, and highly impressive.</p><p>Sustainable creativity begins when a person clearly sees a real need.</p>",
    tags: "sáng tạo,nhận thức",
    cover_url: "",
    created_at: "2026-02-26T08:00:00.000Z"
  },
  {
    slug: "cong-dong-khong-phai-dam-dong",
    type: "post",
    title_vi: "Cộng đồng không phải đám đông, mà là những người cùng giữ một hướng đi",
    title_en: "Community is not a crowd, but people holding the same direction",
    excerpt_vi: "Một cộng đồng đúng không được xây bằng tiếng ồn, mà bằng sự tin cậy, trách nhiệm và khả năng cùng đi xa.",
    excerpt_en: "A true community is not built by noise, but by trust, responsibility, and the capacity to travel far together.",
    content_vi: "<p>Nhiều nơi tự gọi mình là cộng đồng chỉ vì có nhiều người xuất hiện cùng lúc.</p><p>Cộng đồng chỉ bắt đầu khi có giá trị chung.</p>",
    content_en: "<p>Many places call themselves a community simply because many people appear at once.</p><p>Community begins only when shared values exist.</p>",
    tags: "cộng đồng",
    cover_url: "",
    created_at: "2026-02-20T08:00:00.000Z"
  },
  {
    slug: "mot-doi-song-khong-bi-pha-tan-boi-xa-hoi",
    type: "post",
    title_vi: "Một đời sống không bị phân tán bởi xã hội cần được xây thế nào",
    title_en: "How to build a life not scattered by society",
    excerpt_vi: "Khi không tự thiết kế đời sống của mình, con người sẽ bị kéo vào chương trình của người khác mà không hề nhận ra.",
    excerpt_en: "When you do not design your own life, you get pulled into someone else's program without noticing.",
    content_vi: "<p>Cuộc sống hiện đại đầy những lời mời gọi. Làm nhiều hơn, kiếm nhiều hơn, theo kịp nhiều hơn.</p>",
    content_en: "<p>Modern life is full of invitations. Do more, earn more, keep up with more.</p>",
    tags: "nhận thức,định hướng",
    cover_url: "",
    created_at: "2026-02-14T08:00:00.000Z"
  },
  {
    slug: "doc-cham-de-song-sau",
    type: "post",
    title_vi: "Đọc chậm để sống sâu hơn trong thời đại đọc lướt",
    title_en: "Read slowly to live more deeply in an age of skimming",
    excerpt_vi: "Một bài viết tốt không chỉ cung cấp thông tin, mà mở ra một không gian để người đọc tự gặp lại chính mình.",
    excerpt_en: "A strong piece of writing does not only provide information, but opens a space for the reader to meet themselves again.",
    content_vi: "<p>Trong thời đại mà mọi thứ được tối ưu cho tốc độ, việc đọc cũng bị cuốn vào nhịp đọc lướt.</p>",
    content_en: "<p>In an age where everything is optimized for speed, reading too has been pulled into the rhythm of skimming.</p>",
    tags: "hành trình,nhận thức",
    cover_url: "",
    created_at: "2026-02-10T08:00:00.000Z"
  },
  {
    slug: "khoi-nghiep-tu-noi-song-that",
    type: "post",
    title_vi: "Khởi nghiệp từ nơi sống thật thay vì từ nỗi sợ phải chứng minh",
    title_en: "Building from real living instead of the fear of proving yourself",
    excerpt_vi: "Nếu bắt đầu chỉ để chứng minh mình hơn người khác, ta sẽ rất nhanh kiệt sức trước khi đi đến giá trị thật.",
    excerpt_en: "If you begin only to prove yourself against others, exhaustion arrives long before true value does.",
    content_vi: "<p>Nhiều dự án khởi đầu rất mạnh vì được đẩy bằng năng lượng chứng minh.</p>",
    content_en: "<p>Many ventures start with powerful energy because they are fueled by the need to prove something.</p>",
    tags: "sáng tạo,hành trình",
    cover_url: "",
    created_at: "2026-02-06T08:00:00.000Z"
  },
  {
    slug: "about",
    type: "page",
    title_vi: "Giới thiệu Đường Sao Tỏa Sáng",
    title_en: "About Đường Sao Tỏa Sáng",
    excerpt_vi: "Tầm nhìn, sứ mệnh và định hướng phát triển của nền tảng Đường Sao Tỏa Sáng.",
    excerpt_en: "Vision, mission, and development direction of Đường Sao Tỏa Sáng.",
    content_vi: "<p>Đường Sao Tỏa Sáng là nền tảng tri thức, chương trình và cộng đồng dành cho hành trình tỏa sáng của người Việt trên toàn cầu.</p>",
    content_en: "<p>Đường Sao Tỏa Sáng is a knowledge, program, and community platform for the shining journey of Vietnamese people worldwide.</p>",
    tags: "giới thiệu,hệ thống",
    cover_url: "",
    created_at: "2026-03-01T08:00:00.000Z"
  },
  {
    slug: "program",
    type: "page",
    title_vi: "Chương trình Đường Sao Tỏa Sáng",
    title_en: "Programs of Đường Sao Tỏa Sáng",
    excerpt_vi: "Tổng quan các chuỗi chương trình nghệ thuật, giáo dục, cộng đồng và tri thức.",
    excerpt_en: "Overview of artistic, educational, community, and knowledge program series.",
    content_vi: "<p>DSTS phát triển các chương trình dành cho nghệ sĩ, doanh nhân, tài năng Việt toàn cầu và cộng đồng người Việt muôn nơi.</p>",
    content_en: "<p>DSTS develops programs for artists, entrepreneurs, global Vietnamese talents, and the Vietnamese worldwide community.</p>",
    tags: "chương trình,cộng đồng",
    cover_url: "",
    created_at: "2026-03-01T08:00:00.000Z"
  }
]

export const onRequestGet = async ({ request, env }) => {
  try {
    const url = new URL(request.url)

    const lang = normalizeLang(url.searchParams.get("lang"))
    const type = (url.searchParams.get("type") || "").trim()
    const limit = parseLimit(url.searchParams.get("limit"), 24, 100)
    const q = (url.searchParams.get("q") || "").trim()

    if (!env.DB) {
      const fallback = selectFallback({ type, limit, q, lang })
      return json(fallback)
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
        content_vi,
        content_en,
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

    const sql = queryParts.join("\n")
    const stmt = env.DB.prepare(sql).bind(...bindings)
    const result = await stmt.all()
    const rows = Array.isArray(result.results) ? result.results : []

    if (!rows.length) {
      const fallback = selectFallback({ type, limit, q, lang })
      return json(fallback)
    }

    return json(rows.map((item) => localizeItem(item, lang)))
  } catch (error) {
    const url = new URL(request.url)
    const lang = normalizeLang(url.searchParams.get("lang"))
    const type = (url.searchParams.get("type") || "").trim()
    const limit = parseLimit(url.searchParams.get("limit"), 24, 100)
    const q = (url.searchParams.get("q") || "").trim()

    const fallback = selectFallback({ type, limit, q, lang })
    return json(fallback)
  }
}

function normalizeLang(value) {
  return value === "en" ? "en" : "vi"
}

function parseLimit(value, fallback = 24, max = 100) {
  const n = Number.parseInt(value, 10)
  if (!Number.isFinite(n) || n <= 0) return fallback
  return Math.min(n, max)
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function localizeItem(item, lang) {
  return {
    ...item,
    title: lang === "en"
      ? (item.title_en || item.title_vi || "")
      : (item.title_vi || item.title_en || ""),
    excerpt: lang === "en"
      ? (item.excerpt_en || item.excerpt_vi || "")
      : (item.excerpt_vi || item.excerpt_en || ""),
    content: lang === "en"
      ? (item.content_en || item.content_vi || "")
      : (item.content_vi || item.content_en || "")
  }
}

function selectFallback({ type = "", limit = 24, q = "", lang = "vi" }) {
  let list = [...FALLBACK_CONTENTS]

  if (type) {
    list = list.filter((item) => item.type === type)
  }

  if (q) {
    const keyword = normalizeText(q)
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
      ].join(" "))
      return haystack.includes(keyword)
    })
  }

  list.sort((a, b) => {
    const da = new Date(a.created_at || 0).getTime()
    const db = new Date(b.created_at || 0).getTime()
    return db - da
  })

  return list.slice(0, limit).map((item) => localizeItem(item, lang))
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

