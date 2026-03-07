const SUPABASE_URL = "https://ujucoljgaklwdkcckerl.supabase.co";
const SUPABASE_ANON_KEY = "Matrb72ygwe7gbfyw6gduashcdgcagd7zgchbscybshb";

const REST_BASE = `${SUPABASE_URL}/rest/v1`;

function headers() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json"
  };
}

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

  function setMeta(selector, attr, value) {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      if (attr === "name") el.setAttribute("name", selector.replace(/^meta\[name="|"?\]$/g, ""));
      if (attr === "property") el.setAttribute("property", selector.replace(/^meta\[property="|"?\]$/g, ""));
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  }

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

async function restList(params = {}) {
  const qs = new URLSearchParams();
  qs.set("select", "*");

  const order = params.order || "updated_at.desc";
  const [col, dir] = order.split(".");
  if (col) qs.set("order", `${col}.${dir || "desc"}`);

  if (params.limit) qs.set("limit", String(params.limit));

  const res = await fetch(`${REST_BASE}/contents?${qs.toString()}`, {
    headers: headers()
  });

  if (!res.ok) {
    throw new Error(`REST ${res.status}`);
  }

  const data = await res.json();

  let items = Array.isArray(data) ? data : [];

  if (params.visibility) {
    items = items.filter((x) => !x.visibility || x.visibility === params.visibility);
  }

  if (params.type) {
    items = items.filter((x) => (x.type || "") === params.type);
  }

  return items;
}

function mapContentRow(row = {}) {
  const lang = getLang();
  return {
    raw: row,
    id: row.id || "",
    slug: row.slug || "",
    type: row.type || "page",
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
    created_at: row.created_at || "",
    updated_at: row.updated_at || ""
  };
}

export async function listContents({ visibility = "public", type = "", limit = 20, order = "updated_at.desc" } = {}) {
  const rows = await restList({ visibility, type, limit, order });
  return rows.map(mapContentRow);
}

export async function loadLatestPosts({ limit = 8 } = {}) {
  const rows = await restList({ visibility: "public", limit: 50, order: "updated_at.desc" });
  const posts = rows.filter((x) => (x.type || "") === "post").slice(0, limit);
  return posts.map(mapContentRow);
}

export async function loadBySlug(slug) {
  if (!slug) return null;

  const qs = new URLSearchParams();
  qs.set("select", "*");
  qs.set("slug", `eq.${slug}`);
  qs.set("limit", "1");

  const res = await fetch(`${REST_BASE}/contents?${qs.toString()}`, {
    headers: headers()
  });

  if (!res.ok) {
    throw new Error(`REST ${res.status}`);
  }

  const rows = await res.json();
  if (!rows || !rows.length) return null;
  return mapContentRow(rows[0]);
}

export { esc };
