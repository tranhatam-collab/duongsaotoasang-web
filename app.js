function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

function normalizeLang(input) {
  return input === "en" ? "en" : "vi";
}

export function getLang() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (fromUrl === "vi" || fromUrl === "en") {
    localStorage.setItem("site_lang", fromUrl);
    return fromUrl;
  }
  const fromStorage = localStorage.getItem("site_lang");
  return normalizeLang(fromStorage || "vi");
}

export function setLang(lang) {
  localStorage.setItem("site_lang", normalizeLang(lang));
}

export function langUrl(targetLang, rawUrl = location.pathname + location.search + location.hash) {
  const lang = normalizeLang(targetLang);
  const url = new URL(rawUrl, location.origin);

  if (lang === "en") {
    url.searchParams.set("lang", "en");
  } else {
    url.searchParams.delete("lang");
  }

  return url.pathname + url.search + url.hash;
}

export function mountLangLinks(viId, enId) {
  const vi = document.getElementById(viId);
  const en = document.getElementById(enId);
  if (!vi || !en) return;

  vi.href = langUrl("vi");
  en.href = langUrl("en");

  const current = getLang();
  vi.classList.toggle("active", current === "vi");
  en.classList.toggle("active", current === "en");
}

export function toggleLang() {
  const next = getLang() === "vi" ? "en" : "vi";
  location.href = langUrl(next);
}

export function formatDate(input) {
  if (!input) return "";
  try {
    return new Intl.DateTimeFormat(getLang() === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(input));
  } catch {
    return input;
  }
}

export function setSeo({ title, description, canonical, ogImage } = {}) {
  if (title) document.title = title;

  function ensureMetaByName(name, value) {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  }

  function ensureMetaByProperty(prop, value) {
    let el = document.querySelector(`meta[property="${prop}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", prop);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  }

  if (description) {
    ensureMetaByName("description", description);
    ensureMetaByProperty("og:description", description);
  }

  if (title) {
    ensureMetaByProperty("og:title", title);
  }

  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    ensureMetaByProperty("og:url", canonical);
  }

  if (ogImage) {
    ensureMetaByProperty("og:image", ogImage);
  }
}

function cleanHtml(html = "") {
  return String(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
}

function enhanceMedia(container) {
  container.querySelectorAll("iframe").forEach((iframe) => {
    if (iframe.parentElement?.classList.contains("video-wrap")) return;
    const wrap = document.createElement("div");
    wrap.className = "video-wrap";
    iframe.parentNode.insertBefore(wrap, iframe);
    wrap.appendChild(iframe);
  });

  container.querySelectorAll("img").forEach((img) => {
    if (img.closest("figure")) return;
    const figure = document.createElement("figure");
    figure.className = "article-figure";
    img.parentNode.insertBefore(figure, img);
    figure.appendChild(img);

    const alt = img.getAttribute("alt") || "";
    if (alt.trim()) {
      const cap = document.createElement("figcaption");
      cap.textContent = alt;
      figure.appendChild(cap);
    }
  });
}

export function renderRichHtml(container, html = "") {
  container.innerHTML = cleanHtml(html);
  enhanceMedia(container);
}

function mapContentRow(row = {}) {
  const lang = getLang();
  return {
    raw: row,
    id: row.id || "",
    slug: row.slug || "",
    type: row.type || "page",
    visibility: row.visibility || "public",
    status: row.status || "published",
    title_vi: row.title_vi || "",
    title_en: row.title_en || "",
    excerpt_vi: row.excerpt_vi || "",
    excerpt_en: row.excerpt_en || "",
    body_vi: row.body_vi || "",
    body_en: row.body_en || "",
    title: lang === "en"
      ? (row.title_en || row.title_vi || row.slug || "")
      : (row.title_vi || row.title_en || row.slug || ""),
    excerpt: lang === "en"
      ? (row.excerpt_en || row.excerpt_vi || "")
      : (row.excerpt_vi || row.excerpt_en || ""),
    body: lang === "en"
      ? (row.body_en || row.body_vi || "")
      : (row.body_vi || row.body_en || ""),
    cover_url: row.cover_url || "",
    video_url: row.video_url || "",
    seo_title_vi: row.seo_title_vi || "",
    seo_title_en: row.seo_title_en || "",
    seo_desc_vi: row.seo_desc_vi || "",
    seo_desc_en: row.seo_desc_en || "",
    created_at: row.created_at || "",
    updated_at: row.updated_at || ""
  };
}

export async function listContents({
  visibility = "public",
  type = "",
  status = "published",
  limit = 20,
  order = "updated_at.desc"
} = {}) {
  const url = new URL("/api/contents", location.origin);
  url.searchParams.set("visibility", visibility);
  url.searchParams.set("status", status);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("order", order);
  if (type) url.searchParams.set("type", type);

  const res = await fetch(url.toString(), {
    headers: { accept: "application/json" }
  });

  if (!res.ok) throw new Error(`API ${res.status}`);

  const json = await res.json();
  const rows = Array.isArray(json.items) ? json.items : [];
  return rows.map(mapContentRow);
}

export async function loadLatestPosts({ limit = 8 } = {}) {
  const rows = await listContents({
    visibility: "public",
    status: "published",
    limit: 50,
    order: "updated_at.desc"
  });
  return rows.filter((x) => (x.type || "") === "post").slice(0, limit);
}

export async function loadBySlug(slug) {
  if (!slug) return null;

  const url = new URL("/api/content", location.origin);
  url.searchParams.set("slug", slug);

  const res = await fetch(url.toString(), {
    headers: { accept: "application/json" }
  });

  if (!res.ok) throw new Error(`API ${res.status}`);

  const json = await res.json();
  if (!json.item) return null;
  return mapContentRow(json.item);
}

export function resolveCurrentRoute() {
  const path = location.pathname.replace(/^\/+|\/+$/g, "");
  const parts = path.split("/").filter(Boolean);
  const qs = new URLSearchParams(location.search);
  const qSlug = (qs.get("slug") || "").trim();

  // /posts/slug-bai
  if (parts.length >= 2 && parts[0] === "posts") {
    return {
      kind: "content",
      type: "post",
      slug: decodeURIComponent(parts.slice(1).join("/"))
    };
  }

  // /posts
  if (parts.length === 1 && parts[0] === "posts") {
    return {
      kind: "posts",
      type: "list",
      slug: ""
    };
  }

  // /about /legal /program ...
  if (parts.length === 1 && parts[0] !== "content" && parts[0] !== "index.html") {
    return {
      kind: "content",
      type: "page",
      slug: decodeURIComponent(parts[0])
    };
  }

  // fallback cũ: /content?slug=...
  if ((path === "content" || path === "content.html") && qSlug) {
    return {
      kind: "content",
      type: "page",
      slug: qSlug
    };
  }

  // root
  if (path === "" || path === "index.html") {
    return {
      kind: "home",
      type: "home",
      slug: ""
    };
  }

  return {
    kind: "unknown",
    type: "unknown",
    slug: qSlug || ""
  };
}

export { esc };
