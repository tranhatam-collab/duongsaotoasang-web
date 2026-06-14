// DSTS i18n Utility
// English/Vietnamese language switcher

const translations = {
  vi: {
    'nav.home': 'Trang chủ',
    'nav.club': 'DSTS Club',
    'nav.legacy': 'Kho Lưu Trữ',
    'nav.story-library': 'Thư Viện Câu Chuyện',
    'nav.mentor-network': 'Mạng Lưới Mentor',
    'nav.dream-nurture': 'Nuôi Dưỡng Những Ước Mơ',
    'nav.movement': 'Movement',
    'nav.sponsors': 'Sponsors',
    'nav.contact': 'Liên hệ',
    'hero.title': 'Đường Sao Tỏa Sáng',
    'hero.subtitle': 'Hành trình người Việt toàn cầu',
    'hero.lead': 'DSTS công bố rõ lộ trình phát triển: Foundation, Movement Portal và Star Journey OS, với nguyên tắc không để trang trống, không hứa kết quả ảo và minh bạch mọi bước triển khai.',
    'cta.apply': 'Đăng ký',
    'cta.learn-more': 'Tìm hiểu thêm',
    'footer.rights': '© 2026 Đường Sao Tỏa Sáng. Mọi quyền được bảo lưu.'
  },
  en: {
    'nav.home': 'Home',
    'nav.club': 'DSTS Club',
    'nav.legacy': 'Digital Legacy',
    'nav.story-library': 'Story Library',
    'nav.mentor-network': 'Mentor Network',
    'nav.dream-nurture': 'Dream Nurture',
    'nav.movement': 'Movement',
    'nav.sponsors': 'Sponsors',
    'nav.contact': 'Contact',
    'hero.title': 'Đường Sao Tỏa Sáng',
    'hero.subtitle': 'Journey of Vietnamese People Worldwide',
    'hero.lead': 'DSTS clearly announces the development roadmap: Foundation, Movement Portal and Star Journey OS, with principles of no empty pages, no empty promises, and transparency in every step.',
    'cta.apply': 'Apply',
    'cta.learn-more': 'Learn More',
    'footer.rights': '© 2026 Đường Sao Tỏa Sáng. All rights reserved.'
  }
};

let currentLang = localStorage.getItem('dsts_lang') || 'vi';

export function t(key) {
  return translations[currentLang][key] || key;
}

export function setLang(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('dsts_lang', lang);
    document.documentElement.lang = lang;
    updateContent();
  }
}

export function getLang() {
  return currentLang;
}

export function toggleLang() {
  const newLang = currentLang === 'vi' ? 'en' : 'vi';
  setLang(newLang);
}

function updateContent() {
  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.placeholder = t(key);
    }
  });

  // Update titles
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) {
      el.title = t(key);
    }
  });
}

// Initialize on load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = currentLang;
    updateContent();
  });
}
