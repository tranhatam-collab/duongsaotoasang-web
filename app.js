/* =========================================================
   GLOBAL STATE
========================================================= */

let CURRENT_LANG = "vi";
let CURRENT_ITEM = null;

/* =========================================================
   UTILS
========================================================= */

function qs(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function detectLang() {
  const lang = qs("lang");
  if (lang === "en") return "en";
  return "vi";
}

function setLangLinks() {
  const url = new URL(window.location.href);

  const vi = document.getElementById("langViLink");
  const en = document.getElementById("langEnLink");

  if (!vi || !en) return;

  const urlVi = new URL(url);
  urlVi.searchParams.delete("lang");

  const urlEn = new URL(url);
  urlEn.searchParams.set("lang", "en");

  vi.href = urlVi.pathname + urlVi.search;
  en.href = urlEn.pathname + urlEn.search;
}

/* =========================================================
   API
========================================================= */

async function apiGetContents(params = "") {
  const res = await fetch(`/api/contents${params}`);
  const data = await res.json();
  return data.items || [];
}

async function apiGetContent(slug) {
  const res = await fetch(`/api/content?slug=${encodeURIComponent(slug)}`);
  const data = await res.json();
  return data.item || null;
}

/* =========================================================
   RENDER POSTS LIST
========================================================= */

function renderPosts(items) {
  const list = document.getElementById("postsList");
  if (!list) return;

  list.innerHTML = "";

  items.forEach((item) => {
    const title =
      CURRENT_LANG === "en" ? item.title_en || item.title_vi : item.title_vi;

    const excerpt =
      CURRENT_LANG === "en"
        ? item.excerpt_en || item.excerpt_vi
        : item.excerpt_vi;

    const url = `/posts/${item.slug}`;

    const el = document.createElement("article");
    el.className = "post-card";

    el.innerHTML = `
      <a href="${url}" class="post-link">
        ${
          item.cover_url
            ? `<img src="${item.cover_url}" class="post-cover">`
            : ""
        }
        <h2>${title}</h2>
        <p>${excerpt || ""}</p>
      </a>
    `;

    list.appendChild(el);
  });
}

/* =========================================================
   RENDER CONTENT PAGE
========================================================= */

function renderContent(item) {
  const titleEl = document.getElementById("contentTitle");
  const bodyEl = document.getElementById("contentBody");
  const coverEl = document.getElementById("contentCover");
  const videoEl = document.getElementById("contentVideo");

  if (!titleEl || !bodyEl) return;

  const title =
    CURRENT_LANG === "en" ? item.title_en || item.title_vi : item.title_vi;

  const body =
    CURRENT_LANG === "en" ? item.body_en || item.body_vi : item.body_vi;

  titleEl.textContent = title;

  bodyEl.innerHTML = body || "";

  if (coverEl && item.cover_url) {
    coverEl.src = item.cover_url;
    coverEl.style.display = "block";
  }

  if (videoEl && item.video_url) {
    videoEl.src = item.video_url;
    videoEl.style.display = "block";
  }

  document.title = title;
}

/* =========================================================
   PAGE DETECT
========================================================= */

function getSlugFromPath() {
  const path = window.location.pathname;

  if (path.startsWith("/posts/")) {
    return path.replace("/posts/", "");
  }

  const reserved = ["", "/", "/posts", "/index.html"];

  if (reserved.includes(path)) return null;

  return path.replace("/", "");
}

/* =========================================================
   INIT POSTS PAGE
========================================================= */

async function initPostsPage() {
  const items = await apiGetContents("?type=post&limit=50");
  renderPosts(items);
}

/* =========================================================
   INIT CONTENT PAGE
========================================================= */

async function initContentPage(slug) {
  const item = await apiGetContent(slug);

  if (!item) {
    window.location.href = "/404.html";
    return;
  }

  CURRENT_ITEM = item;

  renderContent(item);
}

/* =========================================================
   INIT
========================================================= */

async function init() {
  CURRENT_LANG = detectLang();
  setLangLinks();

  const slug = getSlugFromPath();

  if (slug) {
    await initContentPage(slug);
    return;
  }

  if (document.getElementById("postsList")) {
    await initPostsPage();
  }
}

document.addEventListener("DOMContentLoaded", init);
