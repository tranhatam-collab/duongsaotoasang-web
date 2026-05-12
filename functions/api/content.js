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
  }
]

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

    const { results } = await env.DB.prepare(query)
      .bind(slug)
      .all()

    if (results && results.length > 0) {
      return json(localizeItem(results[0], lang))
    }

    return fallback ? json(fallback) : json({ error: "not found" }, 404)
  } catch (_err) {
    return fallback ? json(fallback) : json({ error: "server_error" }, 500)
  }
}

function normalizeLang(value) {
  return value === "en" ? "en" : "vi"
}

function findFallback(slug, lang) {
  const item = FALLBACK_CONTENTS.find((entry) => entry.slug === slug)
  return item ? localizeItem(item, lang) : null
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

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  })
}
