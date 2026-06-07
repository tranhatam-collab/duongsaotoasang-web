// DSTS Club App Shell JavaScript
// MVP: localStorage session giả (production cần HttpOnly Secure cookie)

const App = {
  isAuthenticated: false,
  currentRoute: 'home',

  init() {
    this.checkAuth();
    this.setupEventListeners();
    this.setupRouter();
  },

  // Auth check (MVP: localStorage, production: HttpOnly cookie)
  checkAuth() {
    const session = localStorage.getItem('dsts_session');
    // MVP: giả định session tồn tại = authenticated
    // Production: gọi API /api/auth/me với HttpOnly cookie
    this.isAuthenticated = !!session;

    if (this.isAuthenticated) {
      this.showAppShell();
      this.loadRoute(this.currentRoute);
    } else {
      // Redirect to login page
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    }
  },

  showAppShell() {
    document.getElementById('auth-loading').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
  },

  setupEventListeners() {
    // Hamburger menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const drawer = document.getElementById('hamburger-drawer');
    const closeDrawer = document.getElementById('close-drawer');
    const drawerBackdrop = drawer.querySelector('.drawer-backdrop');

    hamburgerBtn.addEventListener('click', () => {
      drawer.classList.remove('hidden');
    });

    const closeDrawerHandler = () => {
      drawer.classList.add('hidden');
    };

    closeDrawer.addEventListener('click', closeDrawerHandler);
    drawerBackdrop.addEventListener('click', closeDrawerHandler);

    // Session expired modal
    const sessionExpiredBtn = document.getElementById('session-expired-btn');
    sessionExpiredBtn.addEventListener('click', () => {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    });
  },

  setupRouter() {
    // Simple path-based router
    const path = window.location.pathname;
    const routeMatch = path.match(/^\/app\/([^/]+)$/);
    
    if (routeMatch) {
      this.currentRoute = routeMatch[1];
    } else {
      this.currentRoute = 'home';
    }

    this.updateBottomNav();
  },

  loadRoute(route) {
    const mainContent = document.getElementById('main-content');
    
    // MVP: render static content for each route
    // Production: fetch from API or render components
    const routeContent = this.getRouteContent(route);
    mainContent.innerHTML = routeContent;
  },

  getRouteContent(route) {
    const routes = {
      home: `
        <div class="page">
          <h2>Home</h2>
          <p>Chào mừng đến DSTS Club!</p>
          <div class="card">
            <h3>Updates</h3>
            <p>Tin tức và cập nhật mới nhất.</p>
          </div>
        </div>
      `,
      club: `
        <div class="page">
          <h2>Club</h2>
          <p>Các Club bạn đã tham gia.</p>
          <div class="card">
            <h3>DSTS Club</h3>
            <p>Member</p>
          </div>
        </div>
      `,
      talkshows: `
        <div class="page">
          <h2>Talk Shows</h2>
          <p>Lịch Talk Shows sắp tới.</p>
          <div class="card">
            <h3>Talk Show Sắp tới</h3>
            <p>Đang cập nhật...</p>
          </div>
        </div>
      `,
      rewards: `
        <div class="page">
          <h2>Rewards</h2>
          <p>Catalog Rewards.</p>
          <div class="card">
            <h3>Digital Rewards</h3>
            <p>Đang cập nhật...</p>
          </div>
        </div>
      `,
      profile: `
        <div class="page">
          <h2>Profile</h2>
          <div class="card">
            <h3>Account</h3>
            <p>Thông tin tài khoản của bạn.</p>
          </div>
          <div class="card">
            <h3>Membership</h3>
            <p>Member</p>
          </div>
          <div class="card">
            <h3>Quick Links</h3>
            <a href="/app/wallet" class="link">Wallet</a>
            <a href="/app/referrals" class="link">Referrals</a>
            <a href="/app/tickets" class="link">Tickets</a>
          </div>
        </div>
      `,
      wallet: `
        <div class="page">
          <h2>Wallet</h2>
          <div class="card">
            <h3>Star Points</h3>
            <p class="balance">0 điểm</p>
            <p class="disclaimer">Star Points là điểm thưởng nội bộ, không phải tiền, không bảo đảm quy đổi thành tiền mặt.</p>
          </div>
          <div class="card">
            <h3>Ledger</h3>
            <p>Chưa có giao dịch.</p>
          </div>
        </div>
      `,
      referrals: `
        <div class="page">
          <h2>Referrals</h2>
          <div class="card">
            <h3>Referral Link</h3>
            <p>Đang tải...</p>
          </div>
          <div class="card">
            <h3>Stats</h3>
            <p>0 referrals</p>
          </div>
        </div>
      `,
      tickets: `
        <div class="page">
          <h2>Tickets</h2>
          <div class="card">
            <h3>My Tickets</h3>
            <p>Chưa có vé.</p>
          </div>
        </div>
      `,
      library: `
        <div class="page">
          <h2>Library</h2>
          <div class="card">
            <h3>Paid Content</h3>
            <p>Đang cập nhật...</p>
          </div>
        </div>
      `,
      support: `
        <div class="page">
          <h2>Support</h2>
          <div class="card">
            <h3>FAQ</h3>
            <p>Đang cập nhật...</p>
          </div>
          <div class="card">
            <h3>Contact</h3>
            <a href="/support" class="link">Liên hệ</a>
          </div>
        </div>
      `
    };

    return routes[route] || routes.home;
  },

  updateBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const route = item.getAttribute('data-route');
      if (route === this.currentRoute) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  },

  // Logout (clear session and cache)
  logout() {
    localStorage.removeItem('dsts_session');
    
    // Clear service worker cache for user data
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage('clear-user-cache');
    }
    
    window.location.href = '/login';
  },

  // Session expired handler
  handleSessionExpired() {
    const modal = document.getElementById('session-expired-modal');
    modal.classList.remove('hidden');
  }
};

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
});

// Handle navigation (simple hash-based for MVP)
window.addEventListener('popstate', () => {
  App.setupRouter();
  App.loadRoute(App.currentRoute);
});

// Intercept navigation for SPA behavior
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.getAttribute('href')?.startsWith('/app/')) {
    e.preventDefault();
    const route = link.getAttribute('href').replace('/app/', '');
    window.history.pushState({}, '', link.getAttribute('href'));
    App.currentRoute = route;
    App.updateBottomNav();
    App.loadRoute(route);
  }
});
