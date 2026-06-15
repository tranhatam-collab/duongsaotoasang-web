/* DSTS App v5.0 - 2026-05-12 */
(function () {
  "use strict";
  const DSTS = {};

  // Load badge component
  if (document.querySelector('link[href="/badge.css"]') === null) {
    const badgeLink = document.createElement('link');
    badgeLink.rel = 'stylesheet';
    badgeLink.href = '/badge.css';
    document.head.appendChild(badgeLink);
  }
  
  const badgeScript = document.createElement('script');
  badgeScript.src = '/badge.js';
  badgeScript.defer = true;
  document.head.appendChild(badgeScript);

  // 10 cặp route có bản dịch thật: VI canonical path -> EN path.
  // Chỉ map đúng các route này; trang chưa dịch KHÔNG tạo link /en/ giả.
  DSTS.LANG_PAIRS = {
    "/": "/en/",
    "/about": "/en/about",
    "/contact": "/en/contact",
    "/donate": "/en/donate",
    "/map": "/en/map",
    "/legacy": "/en/legacy",
    "/register": "/en/register",
    "/sponsor": "/en/sponsor",
    "/trust": "/en/trust",
    "/verify": "/en/verify"
  };

  // Nhận diện ngôn ngữ theo PATHNAME /en/ (không còn dùng ?lang=en).
  DSTS.getLang = function () {
    try {
      const p = window.location.pathname || "/";
      return (p === "/en" || p === "/en/" || p.indexOf("/en/") === 0) ? "en" : "vi";
    } catch (_err) {
      return "vi";
    }
  };

  // Chuẩn hoá một path về dạng VI-canonical (bỏ .html, bỏ tiền tố /en, bỏ trailing slash).
  DSTS.viPath = function (path) {
    let p = (path || "/").replace(/\.html$/, "");
    if (p === "/en" || p === "/en/") return "/";
    if (p.indexOf("/en/") === 0) p = p.slice(3);
    if (p.length > 1) p = p.replace(/\/+$/, "");
    return p || "/";
  };

  // Ở EN: map path VI -> path /en/ cho đúng 10 cặp; route khác giữ nguyên VI (no fake /en/).
  DSTS.withLang = function (href) {
    if (!href) return href;
    try {
      if (DSTS.getLang() !== "en") return href;
      const base = window.location.origin || "https://duongsaotoasang.com";
      const url = new URL(href, base);
      const enPath = DSTS.LANG_PAIRS[DSTS.viPath(url.pathname)];
      if (!enPath) return href;
      const tail = url.search + url.hash;
      return /^https?:\/\//i.test(href) ? base + enPath + tail : enPath + tail;
    } catch (_err) {
      return href;
    }
  };

  DSTS.escapeHTML = function (value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  DSTS.formatDate = function (value) {
    if (!value) return "";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      const lang = DSTS.getLang();
      return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(d);
    } catch (_err) {
      return String(value);
    }
  };

  DSTS.getContentUrl = function (slug, type) {
    const cleanSlug = encodeURIComponent(slug || "");
    if (type === "page") return DSTS.withLang(`/${cleanSlug}`);
    return DSTS.withLang(`/content?slug=${cleanSlug}`);
  };

  DSTS.getPathSlug = function () {
    try {
      const url = new URL(window.location.href);
      const querySlug = url.searchParams.get("slug");
      if (querySlug) return querySlug;

      const parts = url.pathname
        .replace(/\.html$/i, "")
        .split("/")
        .filter(Boolean);
      const last = parts[parts.length - 1] || "";
      if (last && last !== "content") return decodeURIComponent(last);
    } catch (_err) {
      return "";
    }
    return "";
  };

  DSTS.apiFetch = async function (path) {
    const cleanPath = String(path || "");
    const apiPath = cleanPath.startsWith("/api/")
      ? cleanPath
      : `/api${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(apiPath, { signal: controller.signal });
      if (!res.ok) throw new Error(`API request failed: ${res.status}`);
      return res.json();
    } finally {
      window.clearTimeout(timeout);
    }
  };

  DSTS.mountSiteChrome = function (options) {
    const opts = options || {};
    const active = opts.active || "";
    const host = document.getElementById("siteHeader");
    if (!host) return;

    const lang = DSTS.getLang();

    const t = {
      vi: {
        brand: "Đường Sao Tỏa Sáng",
        sub: "DSTS · Hành trình tỏa sáng toàn cầu",
        home: "Trang chủ",
        about: "Giới thiệu",
        program: "Chương trình",
        posts: "Bài viết",
        events: "Sự kiện",
        scripts: "Kịch bản",
        stories: "Câu chuyện",
        mentors: "Mentor",
        ecosystem: "Hệ sinh thái",
        verified: "Xác thực",
        legacy: "Di sản số",
        creatorDashboard: "Creator",
        sponsors: "Tài trợ",
        trustLayer: "Trust",
        globalMap: "Bản đồ",
        donate: "Gây quỹ",
        transparency: "Minh bạch",
        legal: "Pháp lý",
        support: "Hỗ trợ",
        contact: "Liên hệ",
        entityDisclosure: '<strong style="color:#c9b688">Đơn vị nhận quỹ / Fund recipient:</strong> <strong>Angel Edu Tam Foundation Inc.</strong> (South Dakota, Hoa Kỳ / USA)<br><strong style="color:#c9b688">Đại diện tại Việt Nam / Vietnam Representative:</strong> CÔNG TY CỔ PHẦN GIẢI TRÍ NGÔI SAO VIỆT CAN (MST 0315462505) — Lầu 23, 76A Lê Lai, P.Bến Thành, Q.1, TP.HCM<br><strong>Chịu trách nhiệm hoàn toàn / Fully responsible:</strong> <strong>Viet Can New Corp</strong> (Hoa Kỳ / USA)<br><strong>Thanh toán / Payment:</strong> <a href="https://pay.iai.one" target="_blank" rel="noopener">pay.iai.one</a> (PayOS — NHNN)<br><strong>Liên hệ / Contact:</strong> <a href="mailto:contact@mail.iai.one">mail.iai.one</a>',
        scriptsLibrary: "Thư viện kịch bản",
        script1: "The Rising Entrepreneur",
        script2: "The Global Artist",
        script3: "The Singing Icon",
        script4: "The Cinematic Actor",
        script5: "The Thinker",
        openMenu: "Mở menu",
        closeMenu: "Đóng menu",
        scriptMenu: "Mở menu kịch bản"
      },
      en: {
        brand: "Duong Sao Toa Sang",
        sub: "DSTS · The global shining journey",
        home: "Home",
        about: "About",
        program: "Programs",
        posts: "Posts",
        events: "Events",
        scripts: "Scripts",
        stories: "Stories",
        mentors: "Mentors",
        ecosystem: "Ecosystem",
        verified: "Verified",
        legacy: "Legacy",
        creatorDashboard: "Creator",
        sponsors: "Sponsors",
        trustLayer: "Trust",
        globalMap: "Map",
        donate: "Donate",
        transparency: "Transparency",
        legal: "Legal",
        support: "Support",
        contact: "Contact",
        entityDisclosure: '<strong style="color:#c9b688">Fund recipient:</strong> <strong>Angel Edu Tam Foundation Inc.</strong> (South Dakota, USA)<br><strong style="color:#c9b688">Vietnam Representative:</strong> VIET CAN STAR ENTERTAINMENT JSC (MST 0315462505) — 23F, 76A Le Lai, Ben Thanh Ward, Dist.1, Ho Chi Minh City<br><strong>Fully responsible:</strong> <strong>Viet Can New Corp</strong> (USA)<br><strong>Payment:</strong> <a href="https://pay.iai.one" target="_blank" rel="noopener">pay.iai.one</a> (PayOS — NHNN-licensed)<br><strong>Contact:</strong> <a href="mailto:contact@mail.iai.one">mail.iai.one</a>',
        scriptsLibrary: "Script library",
        script1: "The Rising Entrepreneur",
        script2: "The Global Artist",
        script3: "The Singing Icon",
        script4: "The Cinematic Actor",
        script5: "The Thinker",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        scriptMenu: "Open scripts menu"
      }
    }[lang];

    host.innerHTML = `
      <style>
        #siteHeader .site-topbar{
          position:sticky;
          top:0;
          z-index:90;
          backdrop-filter:blur(16px);
        }
        #siteHeader .site-wrap{
          width:min(1240px, calc(100% - 32px));
          margin:0 auto;
        }
        #siteHeader .site-nav{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          padding:12px 0;
        }
        #siteHeader .site-brand{
          display:flex;
          align-items:center;
          gap:12px;
          min-width:0;
          text-decoration:none;
          color:inherit;
        }
        #siteHeader .site-brand-mark{
          width:42px;
          height:42px;
          border-radius:14px;
          flex:0 0 auto;
        }
        #siteHeader .site-brand-text{
          min-width:0;
        }
        #siteHeader .site-brand-title{
          font-weight:800;
          line-height:1.1;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #siteHeader .site-brand-sub{
          font-size:12px;
          line-height:1.2;
          margin-top:4px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #siteHeader .site-nav-right{
          display:flex;
          align-items:center;
          gap:14px;
        }
        #siteHeader .site-mobile-toggle{
          display:none;
          width:44px;
          height:44px;
          align-items:center;
          justify-content:center;
          border-radius:14px;
          border:1px solid rgba(224,200,150,.12);
          background:rgba(255,255,255,.04);
          color:#f8fafc;
          cursor:pointer;
        }
        #siteHeader .site-menu{
          display:flex;
          align-items:center;
          gap:8px;
          flex-wrap:wrap;
        }
        #siteHeader .site-menu a,
        #siteHeader .site-menu button{
          text-decoration:none;
          background:none;
          color:#bfc9d7;
          font:inherit;
          cursor:pointer;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          white-space:nowrap;
          border:1px solid transparent;
          transition:.22s ease;
        }
        #siteHeader .site-lang{
          display:flex;
          gap:8px;
          align-items:center;
        }
        #siteHeader .site-lang a{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-width:44px;
          height:40px;
          border-radius:999px;
          border:1px solid rgba(224,200,150,.12);
          text-decoration:none;
          transition:.22s ease;
        }
        #siteHeader .site-scripts{
          position:relative;
        }
        #siteHeader .site-scripts-toggle{
          gap:8px;
        }
        #siteHeader .site-scripts-caret{
          font-size:11px;
          line-height:1;
          opacity:.9;
          transform:translateY(1px);
        }
        #siteHeader .site-scripts-panel{
          position:absolute;
          top:calc(100% + 10px);
          left:0;
          min-width:300px;
          padding:10px;
          border-radius:18px;
          border:1px solid rgba(224,200,150,.12);
          background:rgba(9,14,24,.97);
          box-shadow:0 18px 48px rgba(0,0,0,.34);
          display:none;
          z-index:120;
        }
        #siteHeader .site-scripts.open .site-scripts-panel{
          display:block;
        }
        #siteHeader .site-scripts-panel a{
          display:block;
          min-height:auto !important;
          height:auto !important;
          padding:12px 14px !important;
          border-radius:14px;
          color:#dce5f2;
          line-height:1.5;
          border:1px solid transparent;
          text-decoration:none;
        }
        #siteHeader .site-scripts-panel a:hover{
          background:rgba(224,200,150,.10);
          color:#fff6df;
          border-color:rgba(224,200,150,.12);
        }
        #siteHeader .site-scripts-panel a.active{
          background:linear-gradient(180deg, rgba(224,200,150,.16), rgba(224,200,150,.08));
          color:#fff3d1;
          border-color:rgba(224,200,150,.24);
        }
        @media (max-width: 960px){
          #siteHeader .site-nav{
            flex-wrap:wrap;
          }
          #siteHeader .site-nav-right{
            width:100%;
            display:block;
          }
          #siteHeader .site-mobile-toggle{
            display:inline-flex;
          }
          #siteHeader .site-menu{
            display:none;
            width:100%;
            padding-top:12px;
            flex-direction:column;
            align-items:stretch;
          }
          #siteHeader .site-menu.open{
            display:flex;
          }
          #siteHeader .site-menu a,
          #siteHeader .site-menu button{
            width:100%;
            justify-content:space-between;
          }
          #siteHeader .site-scripts{
            width:100%;
          }
          #siteHeader .site-scripts-panel{
            position:static;
            min-width:auto;
            margin-top:8px;
          }
          #siteHeader .site-lang{
            margin-top:12px;
          }
        }
      </style>

      <div class="site-topbar">
        <div class="site-wrap">
          <div class="site-nav">
            <a class="site-brand" href="${DSTS.withLang("/")}">
              <span class="site-brand-mark"></span>
              <span class="site-brand-text">
                <span class="site-brand-title">${DSTS.escapeHTML(t.brand)}</span>
                <span class="site-brand-sub">${DSTS.escapeHTML(t.sub)}</span>
              </span>
            </a>

            <div class="site-nav-right">
              <button class="site-mobile-toggle" type="button" aria-expanded="false" aria-label="${DSTS.escapeHTML(t.openMenu)}">
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display:block">
                  <line x1="1" y1="2" x2="21" y2="2"/>
                  <line x1="1" y1="9" x2="21" y2="9"/>
                  <line x1="1" y1="16" x2="21" y2="16"/>
                </svg>
              </button>

              <nav class="site-menu" aria-label="Main navigation">
                <a href="${DSTS.withLang("/")}" data-key="home">${DSTS.escapeHTML(t.home)}</a>
                <a href="${DSTS.withLang("/about")}" data-key="about">${DSTS.escapeHTML(t.about)}</a>
                <a href="${DSTS.withLang("/program")}" data-key="program">${DSTS.escapeHTML(t.program)}</a>
                <a href="${DSTS.withLang("/posts")}" data-key="posts">${DSTS.escapeHTML(t.posts)}</a>
                <a href="${DSTS.withLang("/events")}" data-key="events">${DSTS.escapeHTML(t.events)}</a>
                <a href="${DSTS.withLang("/story-library")}" data-key="stories">${DSTS.escapeHTML(t.stories)}</a>
                <a href="${DSTS.withLang("/mentor-network")}" data-key="mentors">${DSTS.escapeHTML(t.mentors)}</a>

                <div class="site-scripts" data-key="ecosystem">
                  <button class="site-scripts-toggle" type="button" aria-expanded="false" aria-label="${DSTS.escapeHTML(t.scriptMenu)}">
                    <span>${DSTS.escapeHTML(t.ecosystem)}</span>
                    <span class="site-scripts-caret">▾</span>
                  </button>
                  <div class="site-scripts-panel">
                    <a href="${DSTS.withLang("/verified")}" data-key="verified">${DSTS.escapeHTML(t.verified)}</a>
                    <a href="${DSTS.withLang("/legacy")}" data-key="legacy">${DSTS.escapeHTML(t.legacy)}</a>
                    <a href="${DSTS.withLang("/creator-dashboard")}" data-key="creator-dashboard">${DSTS.escapeHTML(t.creatorDashboard)}</a>
                    <a href="${DSTS.withLang("/sponsors")}" data-key="sponsors">${DSTS.escapeHTML(t.sponsors)}</a>
                    <a href="${DSTS.withLang("/trust-layer")}" data-key="trust-layer">${DSTS.escapeHTML(t.trustLayer)}</a>
                    <a href="${DSTS.withLang("/global-map")}" data-key="global-map">${DSTS.escapeHTML(t.globalMap)}</a>
                  </div>
                </div>

                <div class="site-scripts" data-key="scripts">
                  <button class="site-scripts-toggle" type="button" aria-expanded="false" aria-label="${DSTS.escapeHTML(t.scriptMenu)}">
                    <span>${DSTS.escapeHTML(t.scripts)}</span>
                    <span class="site-scripts-caret">▾</span>
                  </button>
                  <div class="site-scripts-panel">
                    <a href="${DSTS.withLang("/scripts")}">${DSTS.escapeHTML(t.scriptsLibrary)}</a>
                    <a href="${DSTS.withLang("/scripts/rising-entrepreneur")}">${DSTS.escapeHTML(t.script1)}</a>
                    <a href="${DSTS.withLang("/scripts/global-artist")}">${DSTS.escapeHTML(t.script2)}</a>
                    <a href="${DSTS.withLang("/scripts/singing-icon")}">${DSTS.escapeHTML(t.script3)}</a>
                    <a href="${DSTS.withLang("/scripts/cinematic-actor")}">${DSTS.escapeHTML(t.script4)}</a>
                    <a href="${DSTS.withLang("/scripts/the-thinker")}">${DSTS.escapeHTML(t.script5)}</a>
                  </div>
                </div>

                <a href="${DSTS.withLang("/donate")}" data-key="donate">${DSTS.escapeHTML(t.donate)}</a>
                <a href="${DSTS.withLang("/transparency")}" data-key="transparency">${DSTS.escapeHTML(t.transparency)}</a>
                <a href="${DSTS.withLang("/legal")}" data-key="legal">${DSTS.escapeHTML(t.legal)}</a>
                <a href="${DSTS.withLang("/support")}" data-key="support">${DSTS.escapeHTML(t.support)}</a>
                <a href="${DSTS.withLang("/contact")}" data-key="contact">${DSTS.escapeHTML(t.contact)}</a>
              </nav>

              <div class="site-lang">
                <a href="${DSTS.viPath(window.location.pathname) + window.location.search + window.location.hash}" data-lang="vi">VI</a>
                <a href="${DSTS.LANG_PAIRS[DSTS.viPath(window.location.pathname)] || "/en/"}" data-lang="en">EN</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const menu = host.querySelector(".site-menu");
    const mobileToggle = host.querySelector(".site-mobile-toggle");
    const scriptWrap = host.querySelector(".site-scripts");
    const scriptToggle = host.querySelector(".site-scripts-toggle");
    const scriptPanel = host.querySelector(".site-scripts-panel");

    if (mobileToggle && menu) {
      mobileToggle.addEventListener("click", function () {
        const open = menu.classList.toggle("open");
        mobileToggle.setAttribute("aria-expanded", String(open));
        mobileToggle.setAttribute("aria-label", open ? t.closeMenu : t.openMenu);
      });
    }

    if (scriptToggle && scriptWrap) {
      scriptToggle.addEventListener("click", function (e) {
        e.preventDefault();
        const open = scriptWrap.classList.toggle("open");
        scriptToggle.setAttribute("aria-expanded", String(open));
      });

      document.addEventListener("click", function (e) {
        if (!scriptWrap.contains(e.target)) {
          scriptWrap.classList.remove("open");
          scriptToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    Array.from(host.querySelectorAll(".site-menu [data-key], .site-scripts-panel a")).forEach(function (el) {
      const href = el.getAttribute("href") || "";
      const currentPath = window.location.pathname;
      const isMatch =
        (active && el.getAttribute("data-key") === active) ||
        (href !== "/" && currentPath === href) ||
        (href !== "/" && currentPath.startsWith(href.replace(/\.html$/, ""))) ||
        (href === "/" && currentPath === "/");

      if (isMatch) el.classList.add("active");
    });

    if (active === "scripts" && scriptWrap) {
      scriptWrap.classList.add("active");
    }

    Array.from(host.querySelectorAll(".site-lang a")).forEach(function (el) {
      if (el.getAttribute("data-lang") === lang) {
        el.classList.add("active");
      }
    });

    const footer = document.querySelector(".site-footer-inner, .footer, .site-footer");
    if (footer && !footer.textContent.includes("Angel Edu Tam Foundation")) {
      const disclosure = document.createElement("p");
      disclosure.className = "dsts-entity-disclosure";
      disclosure.innerHTML = t.entityDisclosure;
      disclosure.style.cssText = "margin:10px 0 0;color:#8f9bad;font-size:13px;line-height:1.65;";
      footer.appendChild(disclosure);
    }
    DSTS.initCookieBanner();
  };

  DSTS.initCookieBanner = function () {
    if (localStorage.getItem("dsts_cookie_consent")) return;
    const banner = document.createElement("div");
    banner.id = "dsts-cookie-banner";
    banner.innerHTML = '<span>Trang web sử dụng cookie để cải thiện trải nghiệm. Tiếp tục sử dụng nghĩa là bạn đồng ý.</span><button id="dsts-cookie-ok">Đồng ý</button>';
    banner.style.cssText = "position:fixed;bottom:0;left:0;right:0;z-index:9999;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:14px 18px;background:rgba(8,12,19,.95);border-top:1px solid rgba(224,200,150,.15);color:#cfd9e8;font-size:14px;line-height:1.5;";
    banner.querySelector("button").style.cssText = "padding:6px 14px;border-radius:8px;border:1px solid rgba(224,200,150,.3);background:rgba(224,200,150,.12);color:#f0e4c8;cursor:pointer;font-size:13px;font-weight:700;";
    document.body.appendChild(banner);
    banner.querySelector("button").addEventListener("click", function () {
      localStorage.setItem("dsts_cookie_consent", "1");
      banner.remove();
    });
  };

  window.DSTS = DSTS;
})();
