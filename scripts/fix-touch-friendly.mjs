#!/usr/bin/env node

/**
 * Fix touch-friendly elements (thêm min-height/width 44px)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Files that need touch-friendly fix
const FILES_TO_FIX = [
  '/app/index.html',
  '/club/membership/index.html',
  '/club/wallet/index.html',
  '/content/homepage-v3-sections.html',
  '/dream-nurture.html',
  '/legacy/index.html',
  '/mentor-network.html',
  '/offline.html',
  '/sponsor/index.html',
  '/trust/index.html',
  '/verify/index.html'
];

function fixFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    let originalContent = content;
    let changes = [];
    
    // Check if already has touch-friendly CSS
    if (content.includes('min-height:44px') || content.includes('min-height: 44px')) {
      return { skipped: true, reason: 'Already has touch-friendly CSS' };
    }
    
    // Add touch-friendly CSS in style tag
    const headEndMatch = content.match(/<\/head>/i);
    if (headEndMatch) {
      const touchCSS = `
  <style>
    button, a, .btn { min-height: 44px; min-width: 44px; }
    input, select, textarea { min-height: 44px; font-size: 16px; }
  </style>`;
      content = content.replace(/<\/head>/i, `${touchCSS}\n</head>`);
      changes.push('Added touch-friendly CSS');
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
  console.log('🔧 FIX TOUCH-FRIENDLY ELEMENTS — Thêm min-height/width 44px\n');
  
  const results = [];
  let totalFixed = 0;
  let skippedFiles = 0;
  let errorFiles = 0;
  
  for (const relativePath of FILES_TO_FIX) {
    const fullPath = join(ROOT_DIR, relativePath);
    const result = fixFile(fullPath);
    
    if (result.skipped) {
      skippedFiles++;
      console.log(`⏭️  Skipped ${relativePath}: ${result.reason}`);
      continue;
    }
    
    if (result.error) {
      errorFiles++;
      console.error(`❌ Error fixing ${relativePath}: ${result.error}`);
      continue;
    }
    
    if (result.fixed) {
      totalFixed++;
      results.push({
        file: relativePath,
        changes: result.changes
      });
      console.log(`✅ Fixed ${relativePath}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files: ${FILES_TO_FIX.length}`);
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
    
    console.log(`\n✅ Successfully fixed ${totalFixed} files with touch-friendly CSS\n`);
  } else {
    console.log('ℹ️  No files needed fixing\n');
  }
}

main();
