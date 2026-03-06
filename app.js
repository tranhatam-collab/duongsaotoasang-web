/* =========================================================
   duongsaotoasang-web /app.js
   Public frontend helper for Cloudflare Pages + Supabase REST
   ========================================================= */

/* =========================
   1) SUPABASE CONFIG
   ========================= */
const SUPABASE_URL = "https://ujucoljgaklwdkcckerl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdWNvbGpnYWtsd2RrY2NrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzQ4ODcsImV4cCI6MjA4NTc1MDg4N30.ob2SQH2Zaq2RblmCDsL3avZtwMbh5SVttUWclTTpsoU";

const CMS_TABLE = "contents";
const API_BASE = `${SUPABASE_URL}/rest/v1`;

/* =========================
   2) BASIC HELPERS
   ========================= */
function esc(s = "") {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function safeText(x, fallback = "") {
  if (x === null || x === undefined) return fallback;
  return String(x);
}

function pick(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
      return obj[k];
    }
  }
  return null;
}

function buildHeaders() {
  return {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: buildHeaders() });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status}: ${t || res.statusText}`);
  }
  return res.json();
}

/* =========================
   3) LANGUAGE
   ========================= */
export function getLang() {
  const v = localStorage.getItem("dst_lang");
  return v === "en" ? "en" : "vi";
}

export function setLang(lang) {
  const finalLang = lang === "en" ? "en" : "vi";
  localStorage.setItem("dst_lang", finalLang);
  document.documentElement.lang = finalLang;
}

export function toggleLang() {
  const next = getLang() === "vi" ? "en" : "vi";
  setLang(next);
  location.reload();
}

export function bindLangToggle() {
  const btn = qs("[data-lang-toggle]");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleLang();
  });

  const badge = qs("[data-lang-badge]");
  if (badge) badge.textContent = getLang().toUpperCase();
}

/* =========================
   4) TOPBAR / NAV
   ========================= */
export function mountTopbar() {
  const lang = getLang();
  document.documentElement.lang = lang;
  bindLangToggle();

  const path = location.pathname.replace(/\/+$/g, "") || "/";
  qsa("a[data-nav]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const normalized = href.replace(/\/+$/g, "") || "/";
    if (normalized === path) {
      a.classList.add("active");
    }
  });
}

/* =========================
   5) NORMALIZE CMS ROW
   ========================= */
function normalizeContent(row) {
  const lang = getLang();

  const title = lang === "vi"
    ? pick(row, ["title_vi", "name_vi", "title", "name"])
    : pick(row, ["title_en", "name_en", "title", "name"]);

  const excerpt = lang === "vi"
    ? pick(row, ["excerpt_vi", "summary_vi", "excerpt", "summary", "description_vi"])
    : pick(row, ["excerpt_en", "summary_en", "excerpt", "summary", "description_en"]);

  const body = lang === "vi"
    ? pick(row, ["body_vi", "content_vi", "html_vi", "body", "content", "html"])
    : pick(row, ["body_en", "content_en", "html_en", "body", "content", "html"]);

  const slug = pick(row, ["slug"]);
  const type = pick(row, ["type", "content_type"]);
  const visibility = pick(row, ["visibility"]);
  const createdAt = pick(row, ["created_at", "created"]);
  const updatedAt = pick(row, ["updated_at", "updated"]);
  const cover = pick(row, ["cover_url", "image_url", "image", "cover"]);

  return {
    title: safeText(title, safeText(slug, "Untitled")),
    excerpt: safeText(excerpt, ""),
    body: safeText(body, ""),
    slug: safeText(slug, ""),
    type: safeText(type, ""),
    visibility: safeText(visibility, ""),
    createdAt: safeText(createdAt, ""),
    updatedAt: safeText(updatedAt, ""),
    cover: safeText(cover, ""),
    raw: row
  };
}

/* =========================
   6) CMS LOADERS
   ========================= */

/**
 * Load 1 row by slug
 * URL style in this project:
 * /content?slug=about
 */
export async function loadBySlug(slug) {
  const s = encodeURIComponent(slug);
  const url = `${API_BASE}/${CMS_TABLE}?select=*&slug=eq.${s}&limit=1`;

  const rows = await fetchJson(url);
  if (!rows || !rows.length) return null;

  return normalizeContent(rows[0]);
}

/**
 * List contents from CMS
 * Supports filter by type / visibility
 */
export async function listContents({
  type = null,
  visibility = null,
  limit = 20,
  order = "created_at.desc"
} = {}) {
  const params = new URLSearchParams();
  params.set("select", "*");
  params.set("limit", String(limit));
  params.set("order", order);

  if (visibility) {
    params.set("visibility", `eq.${visibility}`);
  }

  const url = `${API_BASE}/${CMS_TABLE}?${params.toString()}`;
  const rows = await fetchJson(url);
  let list = (rows || []).map(normalizeContent);

  if (type) {
    const wanted = String(type);
    list = list.filter((x) => String(x.raw.type || x.raw.content_type || "") === wanted);
  }

  return list;
}

/**
 * Convenience loader for latest posts
 */
export async function loadLatestPosts({ limit = 6 } = {}) {
  const items = await listContents({
    type: "post",
    visibility: "public",
    limit,
    order: "created_at.desc"
  });

  return items.map((x) => ({
    slug: x.slug,
    title: x.title,
    excerpt: x.excerpt,
    type: x.type || "post",
    cover: x.cover || ""
  }));
}

/* =========================
   7) SEO HELPERS
   ========================= */
export function setSeo({ title, description, canonical, ogImage = null }) {
  if (title) document.title = title;

  const setMeta = (selector, attr, key, value) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value || "");
  };

  if (description) {
    setMeta(`meta[name="description"]`, "name", "description", description);
  }

  if (canonical) {
    let link = document.querySelector(`link[rel="canonical"]`);
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);
  }

  if (title) setMeta(`meta[property="og:title"]`, "property", "og:title", title);
  if (description) setMeta(`meta[property="og:description"]`, "property", "og:description", description);
  if (canonical) setMeta(`meta[property="og:url"]`, "property", "og:url", canonical);
  setMeta(`meta[property="og:type"]`, "property", "og:type", "website");
  if (ogImage) setMeta(`meta[property="og:image"]`, "property", "og:image", ogImage);

  if (title) setMeta(`meta[name="twitter:title"]`, "name", "twitter:title", title);
  if (description) setMeta(`meta[name="twitter:description"]`, "name", "twitter:description", description);
  setMeta(`meta[name="twitter:card"]`, "name", "twitter:card", "summary_large_image");
  if (ogImage) setMeta(`meta[name="twitter:image"]`, "name", "twitter:image", ogImage);
}

/* =========================
   8) SAFE HTML RENDER
   ========================= */
export function renderRichHtml(container, html) {
  if (!container) return;

  // Remove scripts for public safety
  const safe = String(html || "").replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  container.innerHTML = safe;
}

/* =========================
   9) OPTIONAL HELPERS
   ========================= */
export function formatDate(input) {
  if (!input) return "";
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) return String(input);
    return d.toLocaleDateString(getLang() === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return String(input);
  }
}

export function slugFromContentUrl() {
  const params = new URLSearchParams(location.search);
  return (params.get("slug") || "").trim();
}

/* =========================
   10) DEBUG (non-blocking)
   ========================= */
window.__DST_APP__ = {
  SUPABASE_URL,
  CMS_TABLE,
  getLang,
  setLang,
  toggleLang,
  loadBySlug,
  listContents,
  loadLatestPosts,
  setSeo,
  renderRichHtml
};
