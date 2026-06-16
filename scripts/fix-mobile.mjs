#!/usr/bin/env node

/**
 * Fix mobile view (thêm viewport, mobile CSS, app navigation)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
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

function fixFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    let originalContent = content;
    let changes = [];
    
    // Skip English files
    if (filePath.includes('/en/') || filePath.includes('\\en\\')) {
      return { skipped: true, reason: 'English file' };
    }
    
    // Skip _footer.html (special case)
    if (filePath.includes('_footer.html')) {
      return { skipped: true, reason: 'Footer template file' };
    }
    
    // 1. Add viewport meta tag if missing
    if (!content.includes('name="viewport"')) {
      const headMatch = content.match(/<head>/i);
      if (headMatch) {
        const viewportMeta = '<meta name="viewport" content="width=device-width,initial-scale=1">';
        content = content.replace(/<head>/i, `<head>\n  ${viewportMeta}`);
        changes.push('Added viewport meta tag');
      }
    }
    
    // 2. Add mobile CSS if missing
    if (!content.includes('@media') && !content.includes('max-width')) {
      // Add simple mobile CSS in style tag
      const headEndMatch = content.match(/<\/head>/i);
      if (headEndMatch) {
        const mobileCSS = `
  <style>
    @media (max-width: 768px) {
      body { font-size: 14px; }
      .wrap { padding: 0 16px; }
    }
  </style>`;
        content = content.replace(/<\/head>/i, `${mobileCSS}\n</head>`);
        changes.push('Added mobile CSS');
      }
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
  console.log('🔧 FIX MOBILE VIEW — Thêm viewport, mobile CSS, app navigation\n');
  
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
    
    console.log(`\n✅ Successfully fixed ${totalFixed} files\n`);
  } else {
    console.log('ℹ️  No files needed fixing\n');
  }
}

main();
