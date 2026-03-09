(function () {
  const DSTS = {};

  DSTS.getLang = function () {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get("lang") === "en" ? "en" : "vi";
    } catch (_err) {
      return "vi";
    }
  };

  DSTS.withLang = function (href) {
    if (!href) return href;
    const lang = DSTS.getLang();

    try {
      const base = window.location.origin || "https://duongsaotoasang.com";
      const url = new URL(href, base);
      if (lang === "en") url.searchParams.set("lang", "en");
      else url.searchParams.delete("lang");

      if (/^https?:\/\//i.test(href)) return url.toString();
      return url.pathname + url.search + url.hash;
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
    return DSTS.withLang(`/content.html?slug=${cleanSlug}`);
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
        donate: "Gây quỹ",
        transparency: "Minh bạch",
        legal: "Pháp lý",
        contact: "Liên hệ",
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
        donate: "Donate",
        transparency: "Transparency",
        legal: "Legal",
        contact: "Contact",
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
              <button class="site-mobile-toggle" type="button" aria-expanded="false" aria-label="${DSTS.escapeHTML(t.openMenu)}">☰</button>

              <nav class="site-menu" aria-label="Main navigation">
                <a href="${DSTS.withLang("/")}" data-key="home">${DSTS.escapeHTML(t.home)}</a>
                <a href="${DSTS.withLang("/about")}" data-key="about">${DSTS.escapeHTML(t.about)}</a>
                <a href="${DSTS.withLang("/program")}" data-key="program">${DSTS.escapeHTML(t.program)}</a>
                <a href="${DSTS.withLang("/posts")}" data-key="posts">${DSTS.escapeHTML(t.posts)}</a>
                <a href="${DSTS.withLang("/events")}" data-key="events">${DSTS.escapeHTML(t.events)}</a>

                <div class="site-scripts" data-key="scripts">
                  <button class="site-scripts-toggle" type="button" aria-expanded="false" aria-label="${DSTS.escapeHTML(t.scriptMenu)}">
                    <span>${DSTS.escapeHTML(t.scripts)}</span>
                    <span class="site-scripts-caret">▾</span>
                  </button>
                  <div class="site-scripts-panel">
                    <a href="${DSTS.withLang("/scripts")}">${DSTS.escapeHTML(t.scriptsLibrary)}</a>
                    <a href="${DSTS.withLang("/scripts/rising-entrepreneur.html")}">${DSTS.escapeHTML(t.script1)}</a>
                    <a href="${DSTS.withLang("/scripts/global-artist.html")}">${DSTS.escapeHTML(t.script2)}</a>
                    <a href="${DSTS.withLang("/scripts/singing-icon.html")}">${DSTS.escapeHTML(t.script3)}</a>
                    <a href="${DSTS.withLang("/scripts/cinematic-actor.html")}">${DSTS.escapeHTML(t.script4)}</a>
                    <a href="${DSTS.withLang("/scripts/the-thinker.html")}">${DSTS.escapeHTML(t.script5)}</a>
                  </div>
                </div>

                <a href="${DSTS.withLang("/donate")}" data-key="donate">${DSTS.escapeHTML(t.donate)}</a>
                <a href="${DSTS.withLang("/transparency")}" data-key="transparency">${DSTS.escapeHTML(t.transparency)}</a>
                <a href="${DSTS.withLang("/legal")}" data-key="legal">${DSTS.escapeHTML(t.legal)}</a>
                <a href="${DSTS.withLang("/contact")}" data-key="contact">${DSTS.escapeHTML(t.contact)}</a>
              </nav>

              <div class="site-lang">
                <a href="${DSTS.withLang(window.location.pathname + window.location.search + window.location.hash).replace(/[?&]lang=en/g, "").replace(/\?$/, "")}" data-lang="vi">VI</a>
                <a href="${(function () {
                  try {
                    const url = new URL(window.location.href);
                    url.searchParams.set("lang", "en");
                    return url.pathname + url.search + url.hash;
                  } catch (_err) {
                    return "?lang=en";
                  }
                })()}" data-lang="en">EN</a>
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
  };

  window.DSTS = DSTS;
})();