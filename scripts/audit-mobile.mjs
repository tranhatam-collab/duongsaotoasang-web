#!/usr/bin/env node

/**
 * Audit mobile view không giống app mobile
 * 
 * Kiểm tra:
 * 1. Viewport meta tag
 * 2. Mobile-specific CSS
 * 3. Touch-friendly elements
 * 4. App-like navigation
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

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

function auditFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    const issues = [];
    
    // Check viewport meta tag
    const viewportRegex = /<meta[^>]*name=["']viewport["'][^>]*>/i;
    const hasViewport = viewportRegex.test(content);
    
    if (!hasViewport) {
      issues.push({
        type: 'missing_viewport',
        message: 'Missing viewport meta tag'
      });
    }
    
    // Check for mobile-specific CSS
    const hasMobileCSS = /@media.*max-width|@media.*mobile/i.test(content);
    
    if (!hasMobileCSS) {
      issues.push({
        type: 'missing_mobile_css',
        message: 'Missing mobile-specific CSS'
      });
    }
    
    // Check for touch-friendly elements (min-size)
    const hasTouchFriendly = /min-height.*44px|min-width.*44px|padding.*[3-9][0-9]px/i.test(content);
    
    if (!hasTouchFriendly) {
      issues.push({
        type: 'touch_unfriendly',
        message: 'May not have touch-friendly elements (44px min)'
      });
    }
    
    // Check for app-like navigation (bottom nav, hamburger menu, mobile menu toggle, app-v5.js)
    const hasAppNav = /bottom-nav|hamburger|mobile-menu|drawer|mobileMenuToggle|site-mobile-toggle|app-v5\.js/i.test(content);
    
    if (!hasAppNav) {
      issues.push({
        type: 'missing_app_nav',
        message: 'Missing app-like navigation'
      });
    }
    
    return {
      file: filePath.replace(ROOT_DIR, ''),
      hasViewport,
      hasMobileCSS,
      hasTouchFriendly,
      hasAppNav,
      issues
    };
  } catch (error) {
    return { error: error.message };
  }
}

function main() {
  console.log('🔍 MOBILE VIEW AUDIT — Kiểm tra mobile view không giống app mobile\n');
  
  const htmlFiles = getAllHtmlFiles(ROOT_DIR);
  console.log(`📄 Found ${htmlFiles.length} HTML files\n`);
  
  const results = [];
  let filesWithViewport = 0;
  let filesWithMobileCSS = 0;
  let filesWithTouchFriendly = 0;
  let filesWithAppNav = 0;
  let errorFiles = 0;
  
  for (const file of htmlFiles) {
    const result = auditFile(file);
    
    if (result.error) {
      errorFiles++;
      continue;
    }
    
    results.push(result);
    
    if (result.hasViewport) filesWithViewport++;
    if (result.hasMobileCSS) filesWithMobileCSS++;
    if (result.hasTouchFriendly) filesWithTouchFriendly++;
    if (result.hasAppNav) filesWithAppNav++;
  }
  
  console.log(`📊 Summary:`);
  console.log(`   Total files: ${htmlFiles.length}`);
  console.log(`   Errors: ${errorFiles}`);
  console.log(`   Files with viewport: ${filesWithViewport}/${htmlFiles.length}`);
  console.log(`   Files with mobile CSS: ${filesWithMobileCSS}/${htmlFiles.length}`);
  console.log(`   Files with touch-friendly: ${filesWithTouchFriendly}/${htmlFiles.length}`);
  console.log(`   Files with app nav: ${filesWithAppNav}/${htmlFiles.length}\n`);
  
  const filesWithIssues = results.filter(r => r.issues.length > 0);
  
  if (filesWithIssues.length > 0) {
    console.log('❌ FILES WITH MOBILE ISSUES:\n');
    
    for (const result of filesWithIssues) {
      console.log(`📄 ${result.file}`);
      for (const issue of result.issues) {
        console.log(`   - ${issue.type}: ${issue.message}`);
      }
    }
    
    console.log(`\n⚠️  ACTION REQUIRED:`);
    console.log(`   1. Add viewport meta tag to all pages`);
    console.log(`   2. Implement mobile-specific CSS`);
    console.log(`   3. Ensure touch-friendly elements (44px min)`);
    console.log(`   4. Add app-like navigation (bottom nav, hamburger menu)\n`);
  } else {
    console.log('✅ ALL FILES HAVE MOBILE OPTIMIZATIONS\n');
  }
}

main();
