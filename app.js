const SITE = {
  origin: "https://duongsaotoasang.com",
  devOrigin: "https://duongsaotoasang-web.pages.dev",
  siteName: "Đường Sao Tỏa Sáng",
  defaultOg: "/og.png"
};

const LANGS = ["vi", "en"];

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function stripHtml(value) {
  return String(value ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(value, max = 160) {
  const text = String(value ?? "").trim();
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

export function safeUrl(input, fallback = "") {
  const value = String(input ?? "").trim();
  if (!value) return fallback;

  if (
    value.startsWith("/") ||
    value.startsWith("https://") ||
    value.startsWith("http://")
  ) {
    return value;
  }

  return fallback;
}

export function getLang() {
  if (!isBrowser()) return "vi";

  const url = new URL(window.location.href);
  const q = (url.searchParams.get("lang") || "").toLowerCase();

  if (LANGS.includes(q)) {
    try {
      localStorage.setItem("ds_lang", q);
    } catch {}
    return q;
  }

  try {
    const saved = (localStorage.getItem("ds_lang") || "").toLowerCase();
    if (LANGS.includes(saved)) return saved;
  } catch {}

  return "vi";
}

export function setLang(lang) {
  const next = LANGS.includes(lang) ? lang : "vi";
  if (!isBrowser()) return next;

  try {
    localStorage.setItem("ds_lang", next);
  } catch {}

  const url = new URL(window.location.href);
  if (next === "en") url.searchParams.set("lang", "en");
  else url.searchParams.delete("lang");

  window.location.href = `${url.pathname}${url.search}${url.hash}`;
  return next;
}

export function withLang(url, lang = getLang()) {
  const value = String(url || "").trim();
  if (!value) return value;

  const next = LANGS.includes(lang) ? lang : "vi";

  if (!value.startsWith("/") && !value.startsWith("http://") && !value.startsWith("https://")) {
    return value;
  }

  try {
    const u = value.startsWith("http")
      ? new URL(value)
      : new URL(value, window.location.origin);

    if (next === "en") u.searchParams.set("lang", "en");
    else u.searchParams.delete("lang");

    if (value.startsWith("http")) return u.toString();
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return value;
  }
}

export function mountLangLinks(viId, enId) {
  if (!isBrowser()) return;

  const viEl = document.getElementById(viId);
  const enEl = document.getElementById(enId);
  const lang = getLang();

  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (viEl) {
    viEl.href = withLang(currentPath, "vi");
    viEl.classList.toggle("active", lang === "vi");
    viEl.setAttribute("aria-current", lang === "vi" ? "true" : "false");
    viEl.addEventListener("click", (event) => {
      event.preventDefault();
      setLang("vi");
    });
  }

  if (enEl) {
    enEl.href = withLang(currentPath, "en");
    enEl.classList.toggle("active", lang === "en");
    enEl.setAttribute("aria-current", lang === "en" ? "true" : "false");
    enEl.addEventListener("click", (event) => {
      event.preventDefault();
      setLang("en");
    });
  }
}

export function getPathInfo(pathname = isBrowser() ? window.location.pathname : "/") {
  const cleanPath = String(pathname || "/")
    .replace(/\/{2,}/g, "/")
    .replace(/\/+$/, "") || "/";

  const parts = cleanPath.split("/").filter(Boolean);
  const isHome = cleanPath === "/";
  const isPostsIndex = cleanPath === "/posts";
  const isPostDetail = parts[0] === "posts" && parts.length >= 2;

  let slug = "";
  let type = "page";

  if (isPostDetail) {
    slug = decodeURIComponent(parts.slice(1).join("/"));
    type = "post";
  } else if (!isHome && parts.length >= 1) {
    slug = decodeURIComponent(parts[parts.length - 1]);
    type = "page";
  }

  return {
    pathname: cleanPath,
    parts,
    isHome,
    isPostsIndex,
    isPostDetail,
    slug,
    type
  };
}

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const message = text || `HTTP ${response.status}`;
    throw new Error(message);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Invalid JSON response");
  }

  return response.json();
}

export async function loadLatestPosts({ limit = 8, lang = getLang() } = {}) {
  const data = await fetchJson(`/api/contents?limit=${encodeURIComponent(limit)}&lang=${encodeURIComponent(lang)}`);
  return Array.isArray(data) ? data : [];
}

export async function loadPostList({
  limit = 24,
  q = "",
  type = "post",
  lang = getLang()
} = {}) {
  const url = new URL("/api/contents", window.location.origin);
  if (limit) url.searchParams.set("limit", String(limit));
  if (q) url.searchParams.set("q", q);
  if (type) url.searchParams.set("type", type);
  if (lang) url.searchParams.set("lang", lang);

  const data = await fetchJson(`${url.pathname}${url.search}`);
  return Array.isArray(data) ? data : [];
}

export async function loadContentBySlug(slug, lang = getLang()) {
  if (!slug) throw new Error("Missing slug");

  const url = new URL("/api/content", window.location.origin);
  url.searchParams.set("slug", slug);
  url.searchParams.set("lang", lang);

  const data = await fetchJson(`${url.pathname}${url.search}`);
  return data && typeof data === "object" ? data : null;
}

export async function searchContents(query, { limit = 20, lang = getLang() } = {}) {
  const q = String(query || "").trim();
  if (!q) return [];

  const url = new URL("/api/search", window.location.origin);
  url.searchParams.set("q", q);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("lang", lang);

  const data = await fetchJson(`${url.pathname}${url.search}`);
  return Array.isArray(data) ? data : [];
}

export function setSeo({
  title = SITE.siteName,
  description = "",
  canonical = "",
  image = SITE.defaultOg,
  type = "website",
  noindex = false
} = {}) {
  if (!isBrowser()) return;

  const fullTitle = String(title || SITE.siteName).trim();
  const fullDescription = truncate(stripHtml(description), 180) || "";
  const fullCanonical = canonical || window.location.href;
  const fullImage = image.startsWith("http")
    ? image
    : `${window.location.origin}${image.startsWith("/") ? image : `/${image}`}`;

  document.title = fullTitle;

  const ensureMeta = (selector, attr, value) => {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, value);
      document.head.appendChild(el);
    }
    return el;
  };

  const ensureLink = (selector, rel) => {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    return el;
  };

  const metaDescription = ensureMeta('meta[name="description"]', "name", "description");
  metaDescription.setAttribute("content", fullDescription);

  const robots = ensureMeta('meta[name="robots"]', "name", "robots");
  robots.setAttribute("content", noindex ? "noindex,nofollow" : "index,follow");

  const canonicalLink = ensureLink('link[rel="canonical"]', "canonical");
  canonicalLink.setAttribute("href", fullCanonical);

  ensureMeta('meta[property="og:type"]', "property", "og:type").setAttribute("content", type);
  ensureMeta('meta[property="og:site_name"]', "property", "og:site_name").setAttribute("content", SITE.siteName);
  ensureMeta('meta[property="og:title"]', "property", "og:title").setAttribute("content", fullTitle);
  ensureMeta('meta[property="og:description"]', "property", "og:description").setAttribute("content", fullDescription);
  ensureMeta('meta[property="og:url"]', "property", "og:url").setAttribute("content", fullCanonical);
  ensureMeta('meta[property="og:image"]', "property", "og:image").setAttribute("content", fullImage);

  ensureMeta('meta[name="twitter:card"]', "name", "twitter:card").setAttribute("content", "summary_large_image");
  ensureMeta('meta[name="twitter:title"]', "name", "twitter:title").setAttribute("content", fullTitle);
  ensureMeta('meta[name="twitter:description"]', "name", "twitter:description").setAttribute("content", fullDescription);
  ensureMeta('meta[name="twitter:image"]', "name", "twitter:image").setAttribute("content", fullImage);
}

export function applyActiveNav(menuSelector = ".menu", currentPath = isBrowser() ? window.location.pathname : "/") {
  if (!isBrowser()) return;

  const menu = document.querySelector(menuSelector);
  if (!menu) return;

  const path = currentPath.replace(/\/+$/, "") || "/";
  const links = Array.from(menu.querySelectorAll("a[href]"));

  links.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("/")) return;

    const normalizedHref = href.replace(/\/+$/, "") || "/";
    const isActive = normalizedHref === "/"
      ? path === "/"
      : path === normalizedHref || path.startsWith(`${normalizedHref}/`);

    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

export function initMobileMenu({
  buttonId = "mobileToggle",
  menuId = "mainMenu",
  openClass = "open"
} = {}) {
  if (!isBrowser()) return;

  const button = document.getElementById(buttonId);
  const menu = document.getElementById(menuId);
  if (!button || !menu) return;

  button.addEventListener("click", () => {
    const open = menu.classList.toggle(openClass);
    button.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 860) {
        menu.classList.remove(openClass);
        button.setAttribute("aria-expanded", "false");
      }
    });
  });
}

export function initReveal(selector = ".reveal", inClass = "in") {
  if (!isBrowser()) return;

  const nodes = Array.from(document.querySelectorAll(selector));
  if (!nodes.length) return;

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add(inClass));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(inClass);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  nodes.forEach((node) => observer.observe(node));
}

export function formatDate(value, lang = getLang()) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function resolveContentTitle(item, lang = getLang()) {
  if (!item) return "";
  if (lang === "en") {
    return item.title_en || item.title || item.title_vi || item.slug || "";
  }
  return item.title_vi || item.title || item.title_en || item.slug || "";
}

export function resolveContentExcerpt(item, lang = getLang()) {
  if (!item) return "";
  if (lang === "en") {
    return item.excerpt_en || item.excerpt || item.excerpt_vi || "";
  }
  return item.excerpt_vi || item.excerpt || item.excerpt_en || "";
}

export function resolveContentBody(item, lang = getLang()) {
  if (!item) return "";
  if (lang === "en") {
    return item.content_en || item.content || item.content_vi || "";
  }
  return item.content_vi || item.content || item.content_en || "";
}

export function getContentHref(item, lang = getLang()) {
  const slug = encodeURIComponent(item?.slug || "");
  const suffix = lang === "en" ? "?lang=en" : "";
  const type = item?.type || "post";

  if (type === "post") return `/posts/${slug}${suffix}`;
  return `/${slug}${suffix}`;
}

export function createPostCard(item, { lang = getLang(), showImage = true } = {}) {
  const title = resolveContentTitle(item, lang);
  const excerpt = resolveContentExcerpt(item, lang);
  const href = getContentHref(item, lang);
  const cover = safeUrl(item?.cover_url || item?.cover || "");
  const type = item?.type || "post";
  const date = formatDate(item?.created_at || item?.published_at, lang);

  return `
    <a class="item" href="${href}">
      ${showImage && cover ? `
        <div class="thumb">
          <img
            src="${esc(cover)}"
            alt="${esc(title)}"
            loading="lazy"
            decoding="async"
          />
        </div>
      ` : ""}
      <b>${esc(title || (lang === "en" ? "(untitled)" : "(chưa có tiêu đề)"))}</b>
      <div class="small muted">${esc(excerpt || (lang === "en" ? "Open to read details." : "Nhấn để đọc chi tiết."))}</div>
      <div class="meta">${esc(type)}${date ? ` • ${esc(date)}` : ""}</div>
    </a>
  `;
}

export function renderPostList(target, items, options = {}) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  const list = Array.isArray(items) ? items : [];
  if (!list.length) {
    const lang = options.lang || getLang();
    el.innerHTML = `
      <div class="item">
        <b>${lang === "en" ? "No content yet" : "Chưa có nội dung"}</b>
        <div class="small muted">
          ${lang === "en"
            ? "This section will be updated when new content is published."
            : "Khu vực này sẽ được cập nhật khi có nội dung mới được xuất bản."}
        </div>
      </div>
    `;
    return;
  }

  el.innerHTML = list.map((item) => createPostCard(item, options)).join("");
}

export function createRelatedPosts(items, { lang = getLang(), limit = 3 } = {}) {
  const list = (Array.isArray(items) ? items : []).slice(0, limit);
  if (!list.length) return "";

  return list.map((item) => {
    const title = resolveContentTitle(item, lang);
    const href = getContentHref(item, lang);
    return `
      <a class="item" href="${href}">
        <b>${esc(title)}</b>
        <div class="small muted">${esc(resolveContentExcerpt(item, lang))}</div>
      </a>
    `;
  }).join("");
}

export async function renderContentPage({
  titleId = "title",
  contentId = "content",
  excerptId = "excerpt",
  coverId = "cover",
  dateId = "date",
  relatedId = "relatedPosts",
  notFoundTitle = {
    vi: "Nội dung không tồn tại",
    en: "Content not found"
  },
  notFoundDesc = {
    vi: "Liên kết này chưa có nội dung hoặc đã được thay đổi.",
    en: "This link has no content yet or has been changed."
  }
} = {}) {
  if (!isBrowser()) return;

  const lang = getLang();
  const path = getPathInfo(window.location.pathname);
  const slug = path.slug;

  const titleEl = document.getElementById(titleId);
  const contentEl = document.getElementById(contentId);
  const excerptEl = excerptId ? document.getElementById(excerptId) : null;
  const coverEl = coverId ? document.getElementById(coverId) : null;
  const dateEl = dateId ? document.getElementById(dateId) : null;
  const relatedEl = relatedId ? document.getElementById(relatedId) : null;

  if (!slug) {
    if (titleEl) titleEl.textContent = notFoundTitle[lang] || notFoundTitle.vi;
    if (contentEl) contentEl.innerHTML = `<p>${esc(notFoundDesc[lang] || notFoundDesc.vi)}</p>`;
    setSeo({
      title: notFoundTitle[lang] || notFoundTitle.vi,
      description: notFoundDesc[lang] || notFoundDesc.vi,
      canonical: withLang(window.location.pathname, lang),
      noindex: true
    });
    return;
  }

  try {
    const item = await loadContentBySlug(slug, lang);

    if (!item || !item.slug) {
      throw new Error("Content not found");
    }

    const title = resolveContentTitle(item, lang);
    const excerpt = resolveContentExcerpt(item, lang);
    const body = resolveContentBody(item, lang);
    const cover = safeUrl(item.cover_url || item.cover || "");
    const canonical = `${window.location.origin}${withLang(window.location.pathname, lang)}`;

    if (titleEl) titleEl.textContent = title;
    if (excerptEl) excerptEl.textContent = excerpt || "";
    if (contentEl) contentEl.innerHTML = body || `<p>${lang === "en" ? "No content available." : "Chưa có nội dung chi tiết."}</p>`;

    if (coverEl) {
      if (cover) {
        coverEl.innerHTML = `
          <img
            src="${esc(cover)}"
            alt="${esc(title)}"
            loading="eager"
            decoding="async"
          />
        `;
        coverEl.hidden = false;
      } else {
        coverEl.innerHTML = "";
        coverEl.hidden = true;
      }
    }

    if (dateEl) {
      const formatted = formatDate(item.created_at || item.published_at, lang);
      dateEl.textContent = formatted || "";
      dateEl.hidden = !formatted;
    }

    setSeo({
      title: `${title} | ${SITE.siteName}`,
      description: excerpt || truncate(stripHtml(body), 180),
      canonical,
      image: cover || SITE.defaultOg,
      type: "article"
    });

    if (relatedEl) {
      try {
        const related = await loadPostList({ limit: 3, type: "post", lang });
        const filtered = related.filter((x) => x.slug !== item.slug).slice(0, 3);
        relatedEl.innerHTML = createRelatedPosts(filtered, { lang, limit: 3 });
        relatedEl.hidden = filtered.length === 0;
      } catch {
        relatedEl.innerHTML = "";
        relatedEl.hidden = true;
      }
    }
  } catch (error) {
    const title = notFoundTitle[lang] || notFoundTitle.vi;
    const desc = notFoundDesc[lang] || notFoundDesc.vi;

    if (titleEl) titleEl.textContent = title;
    if (excerptEl) excerptEl.textContent = "";
    if (contentEl) {
      contentEl.innerHTML = `
        <p>${esc(desc)}</p>
        <p>
          <a href="${withLang("/posts", lang)}">${lang === "en" ? "View all posts" : "Xem tất cả bài viết"}</a>
        </p>
      `;
    }
    if (coverEl) {
      coverEl.innerHTML = "";
      coverEl.hidden = true;
    }
    if (dateEl) {
      dateEl.textContent = "";
      dateEl.hidden = true;
    }
    if (relatedEl) {
      relatedEl.innerHTML = "";
      relatedEl.hidden = true;
    }

    setSeo({
      title,
      description: desc,
      canonical: `${window.location.origin}${withLang(window.location.pathname, lang)}`,
      noindex: true
    });

    console.warn("renderContentPage:", error);
  }
}

export async function renderPostsPage({
  listId = "posts",
  searchInputId = "searchInput",
  emptyTitle = {
    vi: "Chưa có bài viết",
    en: "No posts yet"
  },
  emptyDesc = {
    vi: "Bài viết sẽ xuất hiện tại đây khi hệ thống có nội dung được xuất bản.",
    en: "Published posts will appear here when content is available."
  }
} = {}) {
  if (!isBrowser()) return;

  const lang = getLang();
  const listEl = document.getElementById(listId);
  const searchEl = searchInputId ? document.getElementById(searchInputId) : null;

  if (!listEl) return;

  const renderEmpty = () => {
    listEl.innerHTML = `
      <div class="item">
        <b>${esc(emptyTitle[lang] || emptyTitle.vi)}</b>
        <div class="small muted">${esc(emptyDesc[lang] || emptyDesc.vi)}</div>
      </div>
    `;
  };

  const performLoad = async (query = "") => {
    try {
      const items = query
        ? await searchContents(query, { limit: 24, lang })
        : await loadPostList({ limit: 24, type: "post", lang });

      if (!items.length) {
        renderEmpty();
        return;
      }

      renderPostList(listEl, items, { lang, showImage: true });
    } catch (error) {
      renderEmpty();
      console.warn("renderPostsPage:", error);
    }
  };

  await performLoad();

  if (searchEl) {
    let timer = null;

    searchEl.addEventListener("input", () => {
      const q = searchEl.value.trim();
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        performLoad(q);
      }, 220);
    });
  }

  setSeo({
    title: lang === "en" ? "Posts | Đường Sao Tỏa Sáng" : "Bài viết | Đường Sao Tỏa Sáng",
    description: lang === "en"
      ? "Explore the latest published content from Star Path Light Up."
      : "Khám phá những bài viết mới nhất từ Đường Sao Tỏa Sáng.",
    canonical: `${window.location.origin}${withLang("/posts", lang)}`
  });
}

export function bootGlobal() {
  if (!isBrowser()) return;

  document.documentElement.lang = getLang();
  applyActiveNav(".menu", window.location.pathname);
  initMobileMenu();
  initReveal(".reveal", "in");
}

if (isBrowser()) {
  document.addEventListener("DOMContentLoaded", () => {
    bootGlobal();
  });
}
