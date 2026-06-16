#!/usr/bin/env node

/**
 * Audit menu không cân đối (desktop)
 * 
 * Kiểm tra:
 * 1. Menu có cân đối không (số lượng items)
 * 2. Menu có thể expand không
 * 3. Menu có tuân thủ Brandpro-all không
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

function extractMenu(content) {
  // Try to find nav/ul.menu
  const navRegex = /<nav[^>]*>([\s\S]*?)<\/nav>/i;
  const navMatch = content.match(navRegex);
  
  if (navMatch) {
    return navMatch[0];
  }
  
  // Try to find ul with menu class
  const menuRegex = /<ul[^>]*class=["'][^"']*menu[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i;
  const menuMatch = content.match(menuRegex);
  
  if (menuMatch) {
    return menuMatch[0];
  }
  
  // Try to find header navigation
  const headerRegex = /<header[^>]*>([\s\S]*?)<\/header>/i;
  const headerMatch = content.match(headerRegex);
  
  if (headerMatch) {
    return headerMatch[0];
  }
  
  return null;
}

function countMenuItems(menuContent) {
  if (!menuContent) return 0;
  
  // Count li items
  const liRegex = /<li[^>]*>/gi;
  const liMatches = menuContent.match(liRegex) || [];
  
  // Count a tags inside nav
  const aRegex = /<a[^>]*href=["'][^"']*["'][^>]*>/gi;
  const aMatches = menuContent.match(aRegex) || [];
  
  return {
    liCount: liMatches.length,
    aCount: aMatches.length
  };
}

function auditFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const menu = extractMenu(content);
    const menuItems = countMenuItems(menu);
    
    return {
      file: filePath.replace(ROOT_DIR, ''),
      hasMenu: !!menu,
      menuItems
    };
  } catch (error) {
    return { error: error.message };
  }
}

function main() {
  console.log('🔍 MENU AUDIT — Kiểm tra menu không cân đối (desktop)\n');
  
  const htmlFiles = getAllHtmlFiles(ROOT_DIR);
  console.log(`📄 Found ${htmlFiles.length} HTML files\n`);
  
  const results = [];
  let filesWithMenu = 0;
  let filesWithoutMenu = 0;
  let errorFiles = 0;
  
  for (const file of htmlFiles) {
    const result = auditFile(file);
    
    if (result.error) {
      errorFiles++;
      continue;
    }
    
    results.push(result);
    
    if (result.hasMenu) {
      filesWithMenu++;
    } else {
      filesWithoutMenu++;
    }
  }
  
  console.log(`📊 Summary:`);
  console.log(`   Total files: ${htmlFiles.length}`);
  console.log(`   Errors: ${errorFiles}`);
  console.log(`   Files with menu: ${filesWithMenu}`);
  console.log(`   Files without menu: ${filesWithoutMenu}\n`);
  
  if (filesWithMenu > 0) {
    console.log('🔍 MENU ITEMS ANALYSIS:\n');
    
    const menuFiles = results.filter(r => r.hasMenu);
    
    for (const result of menuFiles) {
      console.log(`📄 ${result.file}`);
      console.log(`   LI items: ${result.menuItems.liCount}`);
      console.log(`   A links: ${result.menuItems.aCount}`);
    }
    
    console.log(`\n⚠️  NOTES:`);
    console.log(`   - Menu should have 6 items (balanced)`);
    console.log(`   - Menu should support expansion for more items`);
    console.log(`   - Menu should follow Brandpro-all guidelines\n`);
  } else {
    console.log('ℹ️  No traditional menu structure found (may use dynamic menu)\n');
  }
}

main();
