#!/usr/bin/env node

/**
 * Audit chân trang (footer) không nhất quán
 * 
 * Kiểm tra:
 * 1. Footer có nhất quán across các trang không
 * 2. Footer có đủ thông tin không
 * 3. Footer có tuân thủ Brandpro-all không
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

function extractFooter(content) {
  // Try to find footer section
  const footerRegex = /<footer[^>]*>([\s\S]*?)<\/footer>/i;
  const match = content.match(footerRegex);
  
  if (match) {
    return match[0];
  }
  
  // Try to find footer by class
  const footerClassRegex = /<[^>]*class=["'][^"']*footer[^"']*["'][^>]*>([\s\S]*?)<\/[^>]*>/i;
  const classMatch = content.match(footerClassRegex);
  
  if (classMatch) {
    return classMatch[0];
  }
  
  return null;
}

function auditFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const footer = extractFooter(content);
    
    return {
      file: filePath.replace(ROOT_DIR, ''),
      hasFooter: !!footer,
      footer: footer ? footer.substring(0, 200) + '...' : null
    };
  } catch (error) {
    return { error: error.message };
  }
}

function main() {
  console.log('🔍 FOOTER AUDIT — Kiểm tra chân trang không nhất quán\n');
  
  const htmlFiles = getAllHtmlFiles(ROOT_DIR);
  console.log(`📄 Found ${htmlFiles.length} HTML files\n`);
  
  const results = [];
  let filesWithFooter = 0;
  let filesWithoutFooter = 0;
  let errorFiles = 0;
  
  for (const file of htmlFiles) {
    const result = auditFile(file);
    
    if (result.error) {
      errorFiles++;
      continue;
    }
    
    results.push(result);
    
    if (result.hasFooter) {
      filesWithFooter++;
    } else {
      filesWithoutFooter++;
    }
  }
  
  console.log(`📊 Summary:`);
  console.log(`   Total files: ${htmlFiles.length}`);
  console.log(`   Errors: ${errorFiles}`);
  console.log(`   Files with footer: ${filesWithFooter}`);
  console.log(`   Files without footer: ${filesWithoutFooter}\n`);
  
  if (filesWithoutFooter > 0) {
    console.log('❌ FILES WITHOUT FOOTER:\n');
    
    for (const result of results) {
      if (!result.hasFooter) {
        console.log(`📄 ${result.file}`);
      }
    }
    
    console.log(`\n⚠️  ACTION REQUIRED:`);
    console.log(`   1. Add consistent footer to all pages`);
    console.log(`   2. Ensure footer follows Brandpro-all guidelines\n`);
  } else {
    console.log('✅ ALL FILES HAVE FOOTER\n');
    
    // Check if footers are consistent
    console.log('🔍 Checking footer consistency...\n');
    
    const footers = results.filter(r => r.hasFooter).map(r => r.footer);
    const uniqueFooters = new Set(footers);
    
    if (uniqueFooters.size === 1) {
      console.log('✅ FOOTERS ARE CONSISTENT across all pages\n');
    } else {
      console.log(`⚠️  FOOTERS ARE NOT CONSISTENT — Found ${uniqueFooters.size} different footer variations\n`);
    }
  }
}

main();
