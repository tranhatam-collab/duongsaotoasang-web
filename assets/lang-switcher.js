// DSTS Language Switcher
// EN/VI language switcher for i18n

class LangSwitcher {
  constructor(options = {}) {
    this.container = options.container;
    this.currentLang = options.currentLang || 'vi';
    this.availableLangs = options.availableLangs || ['vi', 'en'];
    this.variant = options.variant || 'default'; // 'default', 'compact', 'inline'
    this.onLangChange = options.onLangChange || null;
  }

  getLangLabel(lang) {
    const labels = {
      vi: 'VI',
      en: 'EN'
    };
    return labels[lang] || lang.toUpperCase();
  }

  render() {
    const buttons = this.availableLangs.map(lang => `
      <button 
        class="lang-switcher__btn ${this.currentLang === lang ? 'lang-switcher__btn--active' : ''}"
        data-lang="${lang}"
      >
        ${this.getLangLabel(lang)}
      </button>
    `).join('');

    const divider = this.availableLangs.length > 1 
      ? '<div class="lang-switcher__divider"></div>' 
      : '';

    return `
      <div class="lang-switcher lang-switcher--${this.variant}">
        ${buttons[0]}
        ${divider}
        ${buttons[1]}
      </div>
    `;
  }

  mount() {
    if (this.container) {
      this.container.innerHTML = this.render();
      this.attachEventListeners();
    }
    return this;
  }

  attachEventListeners() {
    const buttons = this.container.querySelectorAll('.lang-switcher__btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const lang = e.target.dataset.lang;
        this.setLang(lang);
      });
    });
  }

  setLang(lang) {
    if (!this.availableLangs.includes(lang)) return;
    
    this.currentLang = lang;
    this.mount();
    
    // Update URL
    this.updateURL();
    
    // Call callback
    if (this.onLangChange) {
      this.onLangChange(lang);
    }
  }

  updateURL() {
    const currentPath = window.location.pathname;
    
    if (this.currentLang === 'en') {
      // Redirect to /en/ path
      if (!currentPath.startsWith('/en')) {
        const newPath = '/en' + (currentPath === '/' ? '/' : currentPath);
        window.history.pushState({}, '', newPath);
      }
    } else {
      // Redirect to VI path
      if (currentPath.startsWith('/en')) {
        const newPath = currentPath.replace('/en', '') || '/';
        window.history.pushState({}, '', newPath);
      }
    }
  }

  detectLang() {
    const path = window.location.pathname;
    if (path.startsWith('/en')) {
      this.setLang('en');
    } else {
      this.setLang('vi');
    }
  }

  static create(options) {
    const switcher = new LangSwitcher(options);
    return switcher.render();
  }

  static mount(options) {
    const switcher = new LangSwitcher(options);
    switcher.detectLang();
    return switcher.mount();
  }
}

// Auto-initialize language switchers on page load
document.addEventListener('DOMContentLoaded', () => {
  const switcherElements = document.querySelectorAll('[data-lang-switcher]');
  
  switcherElements.forEach(element => {
    const currentLang = element.dataset.currentLang || 'vi';
    const availableLangs = element.dataset.availableLangs 
      ? JSON.parse(element.dataset.availableLangs) 
      : ['vi', 'en'];
    const variant = element.dataset.variant || 'default';
    
    const switcher = new LangSwitcher({
      container: element,
      currentLang,
      availableLangs,
      variant,
      onLangChange: (lang) => {
        // Reload page to switch language
        const currentPath = window.location.pathname;
        if (lang === 'en' && !currentPath.startsWith('/en')) {
          window.location.href = '/en' + (currentPath === '/' ? '/' : currentPath);
        } else if (lang === 'vi' && currentPath.startsWith('/en')) {
          window.location.href = currentPath.replace('/en', '') || '/';
        }
      }
    });
    switcher.detectLang();
    switcher.mount();
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LangSwitcher;
}
