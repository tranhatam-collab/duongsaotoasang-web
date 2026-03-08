/* =========================================================
   DUONG SAO TOA SANG
   GLOBAL BASE STYLES ONLY
========================================================= */

:root{
  --bg:#0b0f14;
  --bg-soft:#10161e;
  --card:#121821;
  --card-soft:rgba(255,255,255,.04);

  --gold:#d8bc77;
  --gold-soft:rgba(216,188,119,.18);

  --text:#e6edf3;
  --muted:#9aa7b4;

  --line:rgba(255,255,255,.08);
  --line-strong:rgba(255,255,255,.14);

  --shadow:0 18px 60px rgba(0,0,0,.34);

  --radius:20px;
  --radius-sm:14px;
  --radius-lg:28px;

  --wrap:1240px;

  --content-max:780px;

  --ease:.25s ease;
}

/* =========================================================
   RESET
========================================================= */

*{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

html{
  scroll-behavior:smooth;
}

html,body{
  background:var(--bg);
  color:var(--text);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
  line-height:1.6;
  min-height:100%;
}

body{
  overflow-x:hidden;
  text-rendering:optimizeLegibility;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}

a{
  color:inherit;
  text-decoration:none;
}

img{
  max-width:100%;
  display:block;
}

button,
input,
textarea,
select{
  font:inherit;
}

button{
  color:inherit;
}

/* =========================================================
   SELECTION
========================================================= */

::selection{
  background:rgba(216,188,119,.24);
  color:#fff;
}

/* =========================================================
   LAYOUT
========================================================= */

.wrap{
  max-width:var(--wrap);
  margin:0 auto;
  padding:0 18px;
}

main{
  display:block;
}

/* =========================================================
   TOPBAR / NAV FOUNDATION
========================================================= */

.topbar{
  position:sticky;
  top:0;
  left:0;
  right:0;
  z-index:80;
  background:rgba(10,15,20,.78);
  backdrop-filter:blur(12px);
  border-bottom:1px solid var(--line);
}

.nav{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  min-height:72px;
  padding:10px 0;
}

/* =========================================================
   BRAND
========================================================= */

.brand{
  display:flex;
  align-items:center;
  gap:12px;
  min-width:0;
}

.brand-mark{
  width:40px;
  height:40px;
  flex:0 0 auto;
  border-radius:50%;
  background:
    radial-gradient(circle at center, var(--gold), transparent 70%);
  border:1px solid rgba(255,255,255,.08);
}

.brand-title{
  font-weight:700;
  font-size:16px;
  line-height:1.2;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.brand-sub{
  font-size:12px;
  color:var(--muted);
  line-height:1.3;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

/* =========================================================
   MENU
========================================================= */

.menu{
  display:flex;
  gap:8px;
  align-items:center;
  flex-wrap:wrap;
}

.menu a{
  font-size:14px;
  color:var(--muted);
  padding:10px 12px;
  border-radius:12px;
  border:1px solid transparent;
  transition:all var(--ease);
}

.menu a:hover{
  color:var(--gold);
  background:rgba(255,255,255,.03);
  border-color:var(--line);
}

.menu a.active{
  color:var(--gold);
  background:rgba(255,255,255,.04);
  border-color:var(--line);
}

/* =========================================================
   RIGHT AREA
========================================================= */

.right{
  display:flex;
  align-items:center;
  gap:10px;
}

/* =========================================================
   BUTTONS
========================================================= */

.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;

  min-height:40px;
  padding:8px 14px;

  border-radius:999px;
  border:1px solid var(--line);

  font-size:13px;
  line-height:1.2;

  cursor:pointer;

  background:transparent;
  color:var(--text);

  transition:all var(--ease);
}

.btn:hover{
  border-color:var(--gold);
  color:var(--gold);
  background:rgba(255,255,255,.03);
}

.btn.primary{
  background:var(--gold);
  color:#000;
  border-color:transparent;
}

.btn.primary:hover{
  opacity:.92;
  color:#000;
  background:var(--gold);
}

/* =========================================================
   PILL / TAG / LANGUAGE
========================================================= */

.pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;

  min-height:30px;
  padding:4px 10px;

  font-size:12px;
  line-height:1.2;

  border-radius:999px;
  border:1px solid var(--line);

  color:var(--muted);
  background:rgba(255,255,255,.02);
}

.tag{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;

  min-height:28px;
  padding:6px 10px;

  border-radius:999px;
  border:1px solid var(--line);

  background:rgba(255,255,255,.04);
  color:var(--muted);
  font-size:12px;
  line-height:1.1;
}

.lang-links{
  display:flex;
  gap:8px;
  align-items:center;
}

.lang-link{
  display:inline-flex;
  align-items:center;
  justify-content:center;

  min-width:46px;
  min-height:40px;
  padding:0 12px;

  border-radius:999px;
  border:1px solid var(--line);

  background:rgba(255,255,255,.03);
  color:var(--muted);
  font-size:13px;
  font-weight:700;

  transition:all var(--ease);
}

.lang-link:hover{
  border-color:var(--gold);
  color:var(--gold);
}

.lang-link.active{
  color:#fff;
  background:rgba(216,188,119,.14);
  border-color:rgba(216,188,119,.32);
}

/* =========================================================
   GENERIC CARD / HR / TEXT HELPERS
========================================================= */

.card{
  border:1px solid var(--line);
  background:var(--card-soft);
  border-radius:var(--radius);
  box-shadow:var(--shadow);
}

.hr{
  height:1px;
  background:var(--line);
  margin:16px 0;
}

.small{
  font-size:13px;
}

.muted{
  color:var(--muted);
}

.section-title{
  font-size:26px;
  line-height:1.2;
  margin:0;
}

/* =========================================================
   CONTENT FOUNDATION
========================================================= */

.article-shell{
  max-width:var(--content-max);
  margin:0 auto;
}

.article-body{
  color:var(--text);
}

.article-body p,
.article-body ul,
.article-body ol,
.article-body blockquote{
  margin-bottom:16px;
}

.article-body ul,
.article-body ol{
  padding-left:22px;
}

.article-body li{
  margin-bottom:8px;
}

.article-body img{
  border-radius:18px;
}

.article-figure{
  margin:24px 0;
}

.article-figure figcaption{
  margin-top:10px;
  color:var(--muted);
  font-size:13px;
  line-height:1.7;
}

.video-wrap{
  position:relative;
  width:100%;
  padding-top:56.25%;
  overflow:hidden;
  border-radius:20px;
  background:#000;
}

.video-wrap iframe{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  border:0;
}

/* =========================================================
   LIST / EMPTY STATES
========================================================= */

.list{
  display:grid;
  gap:14px;
}

.posts-empty{
  border:1px solid var(--line);
  padding:20px;
  border-radius:var(--radius);
  color:var(--muted);
  background:rgba(255,255,255,.02);
}

/* =========================================================
   FORMS
========================================================= */

input,
textarea,
select{
  width:100%;
  color:var(--text);
  background:rgba(255,255,255,.03);
  border:1px solid var(--line);
  border-radius:16px;
  outline:none;
}

input,
select{
  min-height:46px;
  padding:12px 14px;
}

textarea{
  min-height:140px;
  padding:14px;
  resize:vertical;
}

input::placeholder,
textarea::placeholder{
  color:var(--muted);
}

input:focus,
textarea:focus,
select:focus{
  border-color:rgba(216,188,119,.34);
  box-shadow:0 0 0 3px rgba(216,188,119,.08);
}

/* =========================================================
   FOOTER
========================================================= */

footer,
.footer{
  border-top:1px solid var(--line);
  margin-top:40px;
  padding:30px 0;
  color:var(--muted);
  font-size:13px;
  line-height:1.8;
}

/* =========================================================
   MOBILE TOGGLE
========================================================= */

.mobile-toggle{
  display:none;
  width:44px;
  height:44px;
  border-radius:12px;
  border:1px solid var(--line);
  background:none;
  color:var(--text);
  font-size:22px;
  line-height:1;
  cursor:pointer;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width:900px){

  .menu{
    position:fixed;
    top:72px;
    left:0;
    right:0;

    background:var(--bg);
    border-bottom:1px solid var(--line);

    flex-direction:column;
    align-items:flex-start;

    padding:18px;
    gap:10px;

    display:none;
    z-index:79;
  }

  .menu.open{
    display:flex;
  }

  .menu a{
    width:100%;
  }

  .mobile-toggle{
    display:inline-flex;
    align-items:center;
    justify-content:center;
  }

  .right{
    display:none;
  }

  .brand-title{
    font-size:15px;
  }
}

/* =========================================================
   SCROLLBAR
========================================================= */

::-webkit-scrollbar{
  width:8px;
}

::-webkit-scrollbar-thumb{
  background:rgba(255,255,255,.2);
  border-radius:20px;
}

::-webkit-scrollbar-thumb:hover{
  background:var(--gold);
}
