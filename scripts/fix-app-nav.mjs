#!/usr/bin/env node

/**
 * Fix app-like navigation (thêm hamburger menu/bottom nav)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Header component with hamburger menu
const HEADER_COMPONENT = `
<header id="siteHeader" style="position:sticky;top:0;z-index:100;background:rgba(8,12,19,.95);border-bottom:1px solid rgba(224,200,150,.12);padding:12px 0">
  <div class="wrap" style="max-width:980px;margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between">
    <a href="/" style="text-decoration:none;color:#f0e4c8;font-weight:600;font-size:16px">
      Đường Sao Tỏa Sáng
    </a>
    <button id="mobileMenuToggle" style="display:none;background:none;border:none;color:#f0e4c8;font-size:24px;cursor:pointer;padding:8px" aria-label="Mở menu">
      ☰
    </button>
    <nav id="desktopMenu" style="display:flex;gap:20px">
      <a href="/" style="color:#bfc9d7;text-decoration:none;font-size:14px">Trang chủ</a>
      <a href="/about" style="color:#bfc9d7;text-decoration:none;font-size:14px">Giới thiệu</a>
      <a href="/program" style="color:#bfc9d7;text-decoration:none;font-size:14px">Chương trình</a>
      <a href="/posts" style="color:#bfc9d7;text-decoration:none;font-size:14px">Bài viết</a>
      <a href="/events" style="color:#bfc9d7;text-decoration:none;font-size:14px">Sự kiện</a>
      <a href="/contact" style="color:#bfc9d7;text-decoration:none;font-size:14px">Liên hệ</a>
    </nav>
  </div>
  <nav id="mobileMenu" style="display:none;background:rgba(8,12,19,.98);padding:20px;flex-direction:column;gap:15px">
    <a href="/" style="color:#f0e4c8;text-decoration:none;font-size:16px;padding:10px">Trang chủ</a>
    <a href="/about" style="color:#f0e4c8;text-decoration:none;font-size:16px;padding:10px">Giới thiệu</a>
    <a href="/program" style="color:#f0e4c8;text-decoration:none;font-size:16px;padding:10px">Chương trình</a>
    <a href="/posts" style="color:#f0e4c8;text-decoration:none;font-size:16px;padding:10px">Bài viết</a>
    <a href="/events" style="color:#f0e4c8;text-decoration:none;font-size:16px;padding:10px">Sự kiện</a>
    <a href="/contact" style="color:#f0e4c8;text-decoration:none;font-size:16px;padding:10px">Liên hệ</a>
  </nav>
  <style>
    @media (max-width: 768px) {
      #desktopMenu { display: none !important; }
      #mobileMenuToggle { display: block !important; }
      #mobileMenu.open { display: flex !important; }
    }
  </style>
  <script>
    document.getElementById('mobileMenuToggle').addEventListener('click', function() {
      document.getElementById('mobileMenu').classList.toggle('open');
    });
  </script>
</header>
`;

function getAllHtmlFiles(dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', '.wrangler', 'functions', 'scripts', 'assets', '.claude'].includes(entry.name)) {
        getAllHtmlFiles(fullPath, files);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      if (!fullPath.includes('.claude/worktrees')) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

function fixFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    let originalContent = content;
    let changes = [];
    
    // Skip English files
    if (filePath.includes('/en/') || filePath.includes('\\en\\')) {
      return { skipped: true, reason: 'English file' };
    }
    
    // Skip files that already have app-v5.js (already has header)
    if (content.includes('app-v5.js')) {
      return { skipped: true, reason: 'Already has app-v5.js header' };
    }
    
    // Skip files that already have mobile menu toggle
    if (content.includes('mobileMenuToggle') || content.includes('site-mobile-toggle')) {
      return { skipped: true, reason: 'Already has mobile menu' };
    }
    
    // Skip app/index.html (already has full header in app-v5.js)
    if (filePath.includes('app/index.html')) {
      return { skipped: true, reason: 'App file has custom header' };
    }
    
    // Skip _footer.html (template file)
    if (filePath.includes('_footer.html')) {
      return { skipped: true, reason: 'Footer template file' };
    }
    
    // Add header after <body> tag
    const bodyMatch = content.match(/<body>/i);
    if (bodyMatch) {
      content = content.replace(/<body>/i, `<body>\n${HEADER_COMPONENT}`);
      changes.push('Added header with hamburger menu');
    }
    
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
      return { fixed: true, changes };
    }
    
    return { fixed: false, changes: [] };
  } catch (error) {
    return { error: error.message };
  }
}

function main() {
  console.log('🔧 FIX APP-LIKE NAVIGATION — Thêm hamburger menu/bottom nav\n');
  
  const htmlFiles = getAllHtmlFiles(ROOT_DIR);
  console.log(`📄 Found ${htmlFiles.length} HTML files\n`);
  
  const results = [];
  let totalFixed = 0;
  let skippedFiles = 0;
  let errorFiles = 0;
  
  for (const file of htmlFiles) {
    const result = fixFile(file);
    
    if (result.skipped) {
      skippedFiles++;
      continue;
    }
    
    if (result.error) {
      errorFiles++;
      console.error(`❌ Error fixing ${file}: ${result.error}`);
      continue;
    }
    
    if (result.fixed) {
      totalFixed++;
      results.push({
        file: file.replace(ROOT_DIR, ''),
        changes: result.changes
      });
    }
  }
  
  console.log(`📊 Summary:`);
  console.log(`   Total files: ${htmlFiles.length}`);
  console.log(`   Skipped: ${skippedFiles}`);
  console.log(`   Errors: ${errorFiles}`);
  console.log(`   Files fixed: ${totalFixed}\n`);
  
  if (results.length > 0) {
    console.log('✅ FIXED FILES:\n');
    
    for (const result of results) {
      console.log(`📄 ${result.file}`);
      for (const change of result.changes) {
        console.log(`   - ${change}`);
      }
    }
    
    console.log(`\n✅ Successfully fixed ${totalFixed} files with app-like navigation\n`);
  } else {
    console.log('ℹ️  No files needed fixing\n');
  }
}

main();
