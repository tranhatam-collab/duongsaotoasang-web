#!/usr/bin/env node

/**
 * STRICT RULES QA — Audit chữ tiếng Anh trong nội dung tiếng Việt
 * 
 * Quy tắc:
 * - KHÔNG ĐƯỢC có chữ tiếng Anh trong nội dung tiếng Việt
 * - Ngoại lệ: Technical term (API, SDK, CLI, JSON, SVG, etc.)
 * - Bỏ qua: file tiếng Anh (en/), code blocks, script tags, style tags
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Technical terms được phép (viết hoa)
const ALLOWED_TECH_TERMS = new Set([
  'API', 'SDK', 'CLI', 'JSON', 'SVG', 'PNG', 'JPG', 'WEBP', 'PDF', 'EPS',
  'HTML', 'CSS', 'JS', 'TS', 'SQL', 'D1', 'KV', 'R2', 'HTTP', 'HTTPS',
  'URL', 'URI', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'UUID', 'JWT',
  'OAuth', 'TOTP', '2FA', 'PWA', 'SEO', 'WCAG', 'CMS', 'CRM', 'ERP',
  'UI', 'UX', 'DX', 'QA', 'CI', 'CD', 'Git', 'GitHub', 'GitLab', 'npm',
  'yarn', 'pnpm', 'Node', 'React', 'Vue', 'Angular', 'Svelte', 'Next',
  'Nuxt', 'Vite', 'Webpack', 'Babel', 'TypeScript', 'JavaScript', 'Python',
  'Go', 'Rust', 'Java', 'C', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Cloudflare', 'Vercel',
  'Netlify', 'Heroku', 'Redis', 'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite',
  'Figma', 'Sketch', 'Adobe', 'Photoshop', 'Illustrator', 'XD', 'InDesign',
  'Notion', 'Google', 'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube',
  'TikTok', 'Zoom', 'Slack', 'Discord', 'Telegram', 'WhatsApp', 'WeChat',
  'iOS', 'Android', 'Windows', 'macOS', 'Linux', 'Unix', 'Chrome', 'Safari',
  'Firefox', 'Edge', 'Opera', 'Brave', 'CORS', 'CSRF', 'XSS', 'SQLi', 'DDoS',
  'WAF', 'CDN', 'DNS', 'TCP', 'UDP', 'IP', 'IPv4', 'IPv6', 'SSL', 'TLS',
  'SSH', 'FTP', 'SFTP', 'HTTP/2', 'HTTP/3', 'SPDY', 'QUIC', 'WebSocket',
  'WebRTC', 'WebAssembly', 'WASM', 'E2E', 'TDD', 'BDD', 'Agile', 'Scrum',
  'Kanban', 'Waterfall', 'DevOps', 'SRE', 'MVP', 'PMF', 'CAC', 'LTV', 'ARPU',
  'DAU', 'MAU', 'ROI', 'ROAS', 'CTR', 'CPC', 'CPM', 'CPA', 'CPL', 'CPS',
  'A/B', 'A/B testing', 'MVT', 'SEO', 'SEM', 'PPC', 'CTR', 'CVR', 'CR',
  'Bounce rate', 'Session', 'Pageview', 'PV', 'UV', 'PV/UV', 'DAU/MAU',
  'Churn', 'Retention', 'LTV', 'CAC', 'ARPU', 'ARPPU', 'MRR', 'ARR', 'NRR',
  'GRR', 'NPS', 'CSAT', 'CES', 'SLA', 'SLO', 'SLI', 'MTTR', 'MTTF', 'MTBF',
  'RTO', 'RPO', 'HA', 'DR', 'BCP', 'DRP', 'SOC', 'ISO', 'GDPR', 'CCPA',
  'PII', 'PCI', 'DSS', 'HIPAA', 'FERPA', 'COPPA', 'LGPD', 'PDPA', 'POPIA',
  // Additional technical terms for web/content (case-insensitive check)
  'video', 'Video', 'audio', 'Audio', 'timeline', 'Timeline', 'roadmap', 'Roadmap',
  'calendar', 'Calendar', 'format', 'Format', 'country', 'Country', 'region', 'Region',
  'directory', 'Directory', 'forward', 'Forward', 'delivery', 'Delivery',
  'target', 'Target', 'strategy', 'Strategy', 'signup', 'Signup', 'download', 'Download',
  'canonical', 'Canonical'
]);

// Từ tiếng Việt phổ biến (whitelist để tránh false positive)
const VIETNAMESE_WORDS = new Set([
  'và', 'là', 'của', 'có', 'không', 'được', 'với', 'cho', 'như', 'này',
  'đó', 'những', 'các', 'để', 'trên', 'dưới', 'vào', 'ra', 'lại', 'nữa',
  'đã', 'sẽ', 'có thể', 'phải', 'nên', 'thì', 'mà', 'nhưng', 'hoặc', 'nếu',
  'tại', 'vì', 'bởi', 'từ', 'đến', 'theo', 'theo', 'về', 'đối', 'với',
  'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười',
  'trăm', 'nghìn', 'triệu', 'tỷ', 'người', 'ngày', 'tháng', 'năm', 'giờ', 'phút',
  'giây', 'lần', 'cách', 'nơi', 'chỗ', 'vấn', 'điều', 'việc', 'cái', 'thứ',
  'loại', 'hình', 'phần', 'trang', 'trang', 'web', 'site', 'app', 'mobile',
  'đăng', 'nhập', 'ký', 'đăng ký', 'đăng nhập', 'thoát', 'gửi', 'nhận', 'xem',
  'đọc', 'viết', 'tìm', 'kiếm', 'lọc', 'sắp', 'xếp', 'chỉnh', 'sửa', 'xóa',
  'lưu', 'hủy', 'đóng', 'mở', 'tiếp', 'trước', 'sau', 'lên', 'xuống', 'về',
  'trang', 'chủ', 'về', 'chúng', 'tôi', 'bạn', 'anh', 'chị', 'em', 'họ',
  'nó', 'cái', 'cô', 'thầy', 'giáo', 'viên', 'học', 'sinh', 'làm', 'việc',
  'học', 'tập', 'chơi', 'ngủ', 'ăn', 'uống', 'sống', 'chết', 'yêu', 'ghét',
  'thích', 'muốn', 'cần', 'phải', 'nên', 'có thể', 'được', 'không', 'được',
  'rất', 'hơi', 'quá', 'lắm', 'nhất', 'hơn', 'kém', 'bằng', 'như', 'tương',
  'tự', 'giống', 'khác', 'mới', 'cũ', 'lớn', 'nhỏ', 'cao', 'thấp', 'dài',
  'ngắn', 'rộng', 'hẹp', 'đẹp', 'xấu', 'tốt', 'xấu', 'sạch', 'bẩn', 'đúng',
  'sai', 'đỏ', 'xanh', 'vàng', 'trắng', 'đen', 'xám', 'nâu', 'cam', 'tím',
  'hồng', 'xanh', 'lá', 'xanh', 'biển', 'trời', 'đất', 'nước', 'lửa', 'khí',
  'gió', 'mưa', 'nắng', 'mây', 'bão', 'tuyết', 'sương', 'mù', 'băng', 'đá'
]);

// Từ tiếng Anh phổ biến cần kiểm tra (viết thường) - chỉ từ dài >= 4 ký tự để giảm false positive
const COMMON_ENGLISH_WORDS = new Set([
  // Từ dài >= 4 ký tự - UI/UX terms
  'click', 'here', 'submit', 'login', 'signup', 'register', 'loading', 'error', 'success', 'warning',
  'support', 'contact', 'about', 'home', 'dashboard', 'settings', 'profile', 'account', 'logout',
  'search', 'filter', 'sort', 'view', 'delete', 'cancel', 'confirm', 'close', 'open', 'next',
  'previous', 'forward', 'website', 'application', 'mobile', 'desktop', 'read', 'show', 'hide',
  'expand', 'collapse', 'toggle', 'remove', 'update', 'create', 'download', 'upload', 'share',
  'receive', 'message', 'notification', 'alert', 'modal', 'dialog', 'button', 'image', 'video',
  'audio', 'document', 'folder', 'directory', 'address', 'title', 'description', 'content',
  'header', 'footer', 'sidebar', 'navigation', 'section', 'placeholder', 'value', 'information',
  'customer', 'client', 'member', 'admin', 'moderator', 'permission', 'access', 'authentication',
  'authorization', 'session', 'password', 'username', 'country', 'region', 'postal', 'shipping',
  'billing', 'payment', 'credit', 'transfer', 'currency', 'discount', 'purchase', 'inventory',
  'delivery', 'tracking', 'history', 'report', 'analytics', 'statistics', 'metric', 'target',
  'objective', 'strategy', 'roadmap', 'timeline', 'schedule', 'calendar', 'meeting', 'appointment',
  'reminder', 'project', 'workflow', 'process', 'pipeline', 'service', 'server', 'client',
  'database', 'storage', 'network', 'connection', 'bandwidth', 'latency', 'performance', 'format',
  'validate', 'sanitize', 'escape', 'encode', 'decode', 'encrypt', 'decrypt', 'identifier',
  'permalink', 'canonical', 'redirect', 'parameter', 'persistent', 'temporary', 'permanent',
  'ephemeral', 'volatile'
]);

// Regex để detect từ tiếng Anh - chỉ từ dài >= 4 ký tự
const ENGLISH_WORD_REGEX = /\b[a-zA-Z]{4,}\b/g;

// Regex để bỏ qua
const IGNORE_PATTERNS = [
  /<script[^>]*>[\s\S]*?<\/script>/gi,  // Script tags
  /<style[^>]*>[\s\S]*?<\/style>/gi,    // Style tags
  /<code[^>]*>[\s\S]*?<\/code>/gi,      // Code blocks
  /<pre[^>]*>[\s\S]*?<\/pre>/gi,        // Pre blocks
  /&[a-zA-Z]+;/g,                        // HTML entities
  /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g,    // URLs
  /["']([^"']*)["']/g,                   // Quoted strings (check content separately)
];

function isEnglishFile(filePath) {
  return filePath.includes('/en/') || filePath.includes('\\en\\');
}

function isTechnicalTerm(word) {
  // Check case-insensitive for technical terms
  return ALLOWED_TECH_TERMS.has(word) || ALLOWED_TECH_TERMS.has(word.toLowerCase()) || ALLOWED_TECH_TERMS.has(word.toUpperCase());
}

function isVietnameseWord(word) {
  const lowerWord = word.toLowerCase();
  return VIETNAMESE_WORDS.has(lowerWord);
}

function isCommonEnglishWord(word) {
  const lowerWord = word.toLowerCase();
  // Skip if it's a Vietnamese word
  if (isVietnameseWord(lowerWord)) {
    return false;
  }
  return COMMON_ENGLISH_WORDS.has(lowerWord);
}

function extractVisibleText(html) {
  // Remove ignored patterns
  let text = html;
  for (const pattern of IGNORE_PATTERNS) {
    text = text.replace(pattern, '');
  }
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  
  return text;
}

function findEnglishWords(text) {
  const words = text.match(ENGLISH_WORD_REGEX) || [];
  const violations = [];
  
  for (const word of words) {
    // Skip if it's part of an email address
    if (text.includes(`${word}@`)) {
      continue;
    }
    
    // Skip if it's in a JavaScript object property (translation keys)
    if (text.includes(`"${word}":`) || text.includes(`'${word}':`) || text.includes(`${word}:`)) {
      continue;
    }
    
    // Skip if it's a technical term (check first)
    if (isTechnicalTerm(word)) {
      continue;
    }
    
    // Skip if it's all uppercase (likely acronym/brand)
    if (word === word.toUpperCase() && word.length >= 2) {
      continue;
    }
    
    // Skip if it's a Vietnamese word
    if (isVietnameseWord(word)) {
      continue;
    }
    
    // Skip if it's a common English word
    if (isCommonEnglishWord(word)) {
      violations.push({
        word,
        type: 'common_english',
        suggestion: 'Dịch sang tiếng Việt'
      });
    }
  }
  
  return violations;
}

function auditFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Skip English files
    if (isEnglishFile(filePath)) {
      return { skipped: true, reason: 'English file' };
    }
    
    // Extract visible text
    const visibleText = extractVisibleText(content);
    
    // Find English words
    const violations = findEnglishWords(visibleText);
    
    return {
      skipped: false,
      violations,
      totalWords: visibleText.split(/\s+/).length
    };
  } catch (error) {
    return { error: error.message };
  }
}

function getAllHtmlFiles(dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules, .git, .claude/worktrees, etc.
      if (!['node_modules', '.git', '.wrangler', 'functions', 'scripts', 'assets', '.claude'].includes(entry.name)) {
        getAllHtmlFiles(fullPath, files);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // Skip .claude/worktrees files
      if (!fullPath.includes('.claude/worktrees')) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

function main() {
  console.log('🔍 STRICT RULES QA — Audit chữ tiếng Anh trong nội dung tiếng Việt\n');
  
  const htmlFiles = getAllHtmlFiles(ROOT_DIR);
  console.log(`📄 Found ${htmlFiles.length} HTML files\n`);
  
  const results = [];
  let totalViolations = 0;
  let skippedFiles = 0;
  let errorFiles = 0;
  
  for (const file of htmlFiles) {
    const result = auditFile(file);
    
    if (result.skipped) {
      skippedFiles++;
      continue;
    }
    
    if (result.error) {
      errorFiles++;
      console.error(`❌ Error reading ${file}: ${result.error}`);
      continue;
    }
    
    if (result.violations.length > 0) {
      totalViolations += result.violations.length;
      results.push({
        file: file.replace(ROOT_DIR, ''),
        violations: result.violations,
        totalWords: result.totalWords
      });
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files: ${htmlFiles.length}`);
  console.log(`   Skipped (English): ${skippedFiles}`);
  console.log(`   Errors: ${errorFiles}`);
  console.log(`   Files with violations: ${results.length}`);
  console.log(`   Total violations: ${totalViolations}\n`);
  
  if (results.length > 0) {
    console.log('❌ VIOLATIONS FOUND:\n');
    
    for (const result of results) {
      console.log(`📄 ${result.file}`);
      console.log(`   Total words: ${result.totalWords}`);
      console.log(`   Violations: ${result.violations.length}`);
      
      // Group by word
      const wordCounts = {};
      for (const v of result.violations) {
        const key = `${v.word} (${v.type})`;
        wordCounts[key] = (wordCounts[key] || 0) + 1;
      }
      
      for (const [word, count] of Object.entries(wordCounts)) {
        console.log(`   - ${word}: ${count}x`);
      }
      console.log();
    }
    
    console.log('⚠️  ACTION REQUIRED:');
    console.log('   1. Review all violations above');
    console.log('   2. Replace English words with Vietnamese equivalents');
    console.log('   3. For technical terms, ensure they are properly explained');
    console.log('   4. Re-run this script to verify fixes\n');
    
    process.exit(1);
  } else {
    console.log('✅ NO VIOLATIONS FOUND — All content is properly in Vietnamese\n');
    process.exit(0);
  }
}

main();
