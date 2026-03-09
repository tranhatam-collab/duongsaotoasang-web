const API_BASE = "/api";

function getLang() {
  const url = new URL(window.location.href);
  return url.searchParams.get("lang") === "en" ? "en" : "vi";
}

function withLang(path) {
  const lang = getLang();
  if (lang !== "en") return path;
  return path.includes("?") ? `${path}&lang=en` : `${path}?lang=en`;
}

function escapeHTML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(getLang() === "en" ? "en-US" : "vi-VN");
}

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json();
}

function getPathSlug() {
  const url = new URL(window.location.href);
  const querySlug = url.searchParams.get("slug");
  if (querySlug) return querySlug;

  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (!path) return "";

  if (path.startsWith("posts/")) {
    return decodeURIComponent(path.slice(6));
  }

  if (["about", "program", "contact", "events", "scripts", "donate", "transparency", "legal"].includes(path)) {
    return path;
  }

  return "";
}

function getContentUrl(slug, type = "post") {
  if (type === "page") return withLang(`/${slug}`);
  return withLang(`/content.html?slug=${encodeURIComponent(slug)}`);
}

function renderPostCard(item, labels = {}) {
  const cover = item.cover_url || "";
  const date = formatDate(item.created_at);
  const typeText = item.type === "page"
    ? (labels.page || "Page")
    : (labels.post || "Post");

  return `
    <article class="post-card">
      ${cover ? `<img src="${escapeHTML(cover)}" alt="${escapeHTML(item.title)}" class="post-cover">` : ""}
      <div class="post-body">
        <div class="post-type">${escapeHTML(typeText)}</div>
        <h3 class="post-title">
          <a href="${getContentUrl(item.slug, item.type)}">${escapeHTML(item.title)}</a>
        </h3>
        <p class="post-excerpt">${escapeHTML(item.excerpt || "")}</p>
        <div class="post-meta">
          <span>${escapeHTML(date)}</span>
          <span>${escapeHTML((item.tags || "").split(",")[0] || "")}</span>
        </div>
      </div>
    </article>
  `;
}

function langSwitchUrl(targetLang) {
  const url = new URL(window.location.href);
  if (targetLang === "en") url.searchParams.set("lang", "en");
  else url.searchParams.delete("lang");
  return `${url.pathname}${url.search}${url.hash}`;
}

function mountSiteChrome(options = {}) {
  const active = options.active || "";
  const lang = getLang();

  const dict = {
    vi: {
      brand: "Đường Sao Tỏa Sáng",
      sub: "Star Path Light Up",
      home: "Trang chủ",
      about: "Giới thiệu",
      program: "Chương trình",
      events: "Sự kiện",
      scripts: "Kịch bản",
      donate: "Gây quỹ",
      transparency: "Minh bạch",
      legal: "Pháp lý",
      contact: "Liên hệ",
      posts: "Bài viết",
      footer: "Đường Sao Tỏa Sáng · Nền tảng xuất bản cho tri thức sâu, nhận thức, sáng tạo và cộng đồng."
    },
    en: {
      brand: "Đường Sao Tỏa Sáng",
      sub: "Star Path Light Up",
      home: "Home",
      about: "About",
      program: "Program",
      events: "Events",
      scripts: "Scripts",
      donate: "Donate",
      transparency: "Transparency",
      legal: "Legal",
      contact: "Contact",
      posts: "Posts",
      footer: "Đường Sao Tỏa Sáng · Publishing platform for deep knowledge, awareness, creativity, and community."
    }
  }[lang];

  const navItems = [
    { key: "home", href: withLang("/"), label: dict.home },
    { key: "about", href: withLang("/about"), label: dict.about },
    { key: "program", href: withLang("/program"), label: dict.program },
    { key: "events", href: withLang("/events"), label: dict.events },
    { key: "scripts", href: withLang("/scripts"), label: dict.scripts },
    { key: "donate", href: withLang("/donate"), label: dict.donate },
    { key: "transparency", href: withLang("/transparency"), label: dict.transparency },
    { key: "legal", href: withLang("/legal"), label: dict.legal },
    { key: "contact", href: withLang("/contact"), label: dict.contact },
    { key: "posts", href: withLang("/posts"), label: dict.posts }
  ];

  const header = document.getElementById("siteHeader");
  if (header) {
    header.innerHTML = `
      <div class="site-topbar">
        <div class="wrap site-nav">
          <a href="${withLang("/")}" class="site-brand">
            <div class="site-brand-mark"></div>
            <div>
              <div class="site-brand-title">${escapeHTML(dict.brand)}</div>
              <div class="site-brand-sub">${escapeHTML(dict.sub)}</div>
            </div>
          </a>

          <div class="site-right">
            <nav class="site-menu">
              ${navItems.map(item => `
                <a href="${item.href}" class="${active === item.key ? "active" : ""}">
                  ${escapeHTML(item.label)}
                </a>
              `).join("")}
            </nav>

            <div class="site-lang">
              <a href="${langSwitchUrl("vi")}" class="${lang === "vi" ? "active" : ""}">VI</a>
              <a href="${langSwitchUrl("en")}" class="${lang === "en" ? "active" : ""}">EN</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const footer = document.getElementById("siteFooter");
  if (footer) {
    footer.innerHTML = `
      <div class="site-footer">
        <div class="wrap site-footer-inner">
          <div>${escapeHTML(dict.footer)}</div>
        </div>
      </div>
    `;
  }
}

window.DSTS = {
  getLang,
  withLang,
  escapeHTML,
  formatDate,
  apiFetch,
  getPathSlug,
  getContentUrl,
  renderPostCard,
  mountSiteChrome
};