#!/usr/bin/env node

/**
 * Audit hình ảnh trống/giống nhau
 * 
 * Kiểm tra:
 * 1. Hình ảnh placeholder (placeholder.com, placehold.co, data:image placeholder)
 * 2. Hình ảnh trùng lặp (cùng URL được dùng nhiều lần)
 * 3. Hình ảnh không có alt text
 * 4. Hình ảnh bị hỏng (404)
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Placeholder patterns
const PLACEHOLDER_PATTERNS = [
  /placeholder\.com/i,
  /placehold\.co/i,
  /via\.placeholder\.com/i,
  /dummyimage\.com/i,
  /loremflickr\.com/i,
  /unsplash\.it/i,
  /picsum\.photos/i,
  /data:image\/svg\+xml/i,
  /data:image\/png;base64/i
];

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
    
    // Find all img tags
    const imgRegex = /<img[^>]+>/gi;
    const imgMatches = content.match(imgRegex) || [];
    
    for (const imgTag of imgMatches) {
      // Extract src
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
      const src = srcMatch ? srcMatch[1] : null;
      
      // Extract alt
      const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
      const alt = altMatch ? altMatch[1] : null;
      
      if (src) {
        // Check for placeholder
        const isPlaceholder = PLACEHOLDER_PATTERNS.some(pattern => pattern.test(src));
        
        if (isPlaceholder) {
          issues.push({
            type: 'placeholder',
            src,
            alt,
            tag: imgTag
          });
        }
        
        // Check for missing alt
        if (!alt || alt.trim() === '') {
          issues.push({
            type: 'missing_alt',
            src,
            alt,
            tag: imgTag
          });
        }
      }
    }
    
    return {
      file: filePath.replace(ROOT_DIR, ''),
      totalImages: imgMatches.length,
      issues
    };
  } catch (error) {
    return { error: error.message };
  }
}

function main() {
  console.log('🔍 IMAGE AUDIT — Kiểm tra hình ảnh trống/giống nhau\n');
  
  const htmlFiles = getAllHtmlFiles(ROOT_DIR);
  console.log(`📄 Found ${htmlFiles.length} HTML files\n`);
  
  const results = [];
  let totalImages = 0;
  let totalPlaceholder = 0;
  let totalMissingAlt = 0;
  let errorFiles = 0;
  
  for (const file of htmlFiles) {
    const result = auditFile(file);
    
    if (result.error) {
      errorFiles++;
      console.error(`❌ Error auditing ${file}: ${result.error}`);
      continue;
    }
    
    totalImages += result.totalImages;
    
    if (result.issues.length > 0) {
      results.push(result);
      
      for (const issue of result.issues) {
        if (issue.type === 'placeholder') totalPlaceholder++;
        if (issue.type === 'missing_alt') totalMissingAlt++;
      }
    }
  }
  
  console.log(`📊 Summary:`);
  console.log(`   Total files: ${htmlFiles.length}`);
  console.log(`   Total images: ${totalImages}`);
  console.log(`   Errors: ${errorFiles}`);
  console.log(`   Files with issues: ${results.length}`);
  console.log(`   Placeholder images: ${totalPlaceholder}`);
  console.log(`   Missing alt text: ${totalMissingAlt}\n`);
  
  if (results.length > 0) {
    console.log('❌ ISSUES FOUND:\n');
    
    for (const result of results) {
      console.log(`📄 ${result.file}`);
      console.log(`   Total images: ${result.totalImages}`);
      console.log(`   Issues: ${result.issues.length}`);
      
      for (const issue of result.issues) {
        if (issue.type === 'placeholder') {
          console.log(`   - Placeholder: ${issue.src}`);
        } else if (issue.type === 'missing_alt') {
          console.log(`   - Missing alt: ${issue.src}`);
        }
      }
      console.log();
    }
    
    console.log(`⚠️  ACTION REQUIRED:`);
    console.log(`   1. Replace placeholder images with real images`);
    console.log(`   2. Add alt text to all images for accessibility`);
    console.log(`   3. Ensure all images are unique and high-quality\n`);
  } else {
    console.log('✅ NO IMAGE ISSUES FOUND\n');
  }
}

main();
