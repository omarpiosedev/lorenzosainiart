#!/usr/bin/env node
/**
 * Image Optimization Script for Production
 *
 * Optimizes all images in public/assets/images to reduce file sizes
 * without sacrificing visual quality for portfolio use.
 *
 * Requirements: npm install --save-dev sharp
 *
 * Usage: node scripts/optimize-images.js
 *
 * What it does:
 * - Converts large images to WebP format
 * - Resizes images to max 2000px width (sufficient for Retina displays)
 * - Applies quality 80 (optimal for photography portfolios)
 * - Creates backups of originals in _originals folder
 * - Skips already optimized images (< 500KB)
 *
 * Expected savings: 70-85% file size reduction
 */

const sharp = require('sharp');
const fs = require('node:fs').promises;
const path = require('node:path');

// Configuration
const CONFIG = {
  sourceDir: path.join(__dirname, '../public/assets/images'),
  backupDir: path.join(__dirname, '../public/assets/images/_originals'),
  maxWidth: 2000, // Max width in pixels (sufficient for Retina @ 1000px display)
  quality: 80, // WebP quality (80 = high quality, good compression)
  skipIfSmallerThan: 500 * 1024, // Skip files < 500KB (already optimized)
  extensions: ['.webp', '.jpg', '.jpeg', '.png'],
};

/**
 * Get all image files recursively
 */
async function getImageFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      // Skip backup directory
      if (entry.name === '_originals') {
        return [];
      }

      if (entry.isDirectory()) {
        return getImageFiles(fullPath);
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (CONFIG.extensions.includes(ext)) {
        return fullPath;
      }

      return [];
    }),
  );

  return files.flat();
}

/**
 * Get file size in bytes
 */
async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * Optimize single image
 */
async function optimizeImage(filePath) {
  const originalSize = await getFileSize(filePath);

  // Skip if already optimized
  if (originalSize < CONFIG.skipIfSmallerThan) {
    console.log(`⏭️  Skipped (already small): ${path.basename(filePath)} (${formatBytes(originalSize)})`);
    return { skipped: true, originalSize, optimizedSize: originalSize };
  }

  const fileName = path.basename(filePath);
  const fileNameWithoutExt = path.parse(fileName).name;
  const relativePath = path.relative(CONFIG.sourceDir, path.dirname(filePath));

  // Create backup directory structure
  const backupDirPath = path.join(CONFIG.backupDir, relativePath);
  await fs.mkdir(backupDirPath, { recursive: true });

  // Backup original
  const backupPath = path.join(backupDirPath, fileName);
  await fs.copyFile(filePath, backupPath);

  // Optimize image
  const outputPath = path.join(path.dirname(filePath), `${fileNameWithoutExt}.webp`);

  // Use temporary file if input and output are the same (already .webp)
  const isSameFile = filePath === outputPath;
  const tempPath = isSameFile
    ? path.join(path.dirname(filePath), `${fileNameWithoutExt}.tmp.webp`)
    : outputPath;

  try {
    await sharp(filePath)
      .resize(CONFIG.maxWidth, null, {
        withoutEnlargement: true, // Don't upscale smaller images
        fit: 'inside',
      })
      .webp({ quality: CONFIG.quality })
      .toFile(tempPath);

    const optimizedSize = await getFileSize(tempPath);
    const savings = originalSize - optimizedSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

    console.log(`✅ ${fileName}`);
    console.log(`   ${formatBytes(originalSize)} → ${formatBytes(optimizedSize)} (saved ${savingsPercent}%)`);

    // If using temp file, replace original with optimized version
    if (isSameFile) {
      await fs.unlink(filePath);
      await fs.rename(tempPath, outputPath);
    } else if (filePath !== outputPath) {
      // Delete original if different from output
      await fs.unlink(filePath);
    }

    return { skipped: false, originalSize, optimizedSize, savings };
  } catch (error) {
    console.error(`❌ Failed to optimize ${fileName}:`, error.message);
    // Clean up temp file if it exists
    try {
      if (isSameFile) {
        await fs.unlink(tempPath);
      }
    } catch {}
    return { skipped: false, originalSize, optimizedSize: originalSize, savings: 0, error: true };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log(`📁 Source: ${CONFIG.sourceDir}`);
  console.log(`💾 Backups: ${CONFIG.backupDir}`);
  console.log(`📏 Max width: ${CONFIG.maxWidth}px`);
  console.log(`🎨 Quality: ${CONFIG.quality}%\n`);

  // Create backup directory
  await fs.mkdir(CONFIG.backupDir, { recursive: true });

  // Get all images
  const imageFiles = await getImageFiles(CONFIG.sourceDir);
  console.log(`Found ${imageFiles.length} images\n`);

  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }

  // Optimize all images
  const results = [];
  for (const filePath of imageFiles) {
    const result = await optimizeImage(filePath);
    results.push(result);
  }

  // Summary
  console.log('\n📊 Summary:');
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const totalSavings = totalOriginal - totalOptimized;
  const totalSavingsPercent = ((totalSavings / totalOriginal) * 100).toFixed(1);
  const skippedCount = results.filter(r => r.skipped).length;
  const errorCount = results.filter(r => r.error).length;
  const optimizedCount = results.length - skippedCount - errorCount;

  console.log(`Total original size: ${formatBytes(totalOriginal)}`);
  console.log(`Total optimized size: ${formatBytes(totalOptimized)}`);
  console.log(`Total savings: ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`);
  console.log(`\nOptimized: ${optimizedCount} | Skipped: ${skippedCount} | Errors: ${errorCount}`);
  console.log(`\n✨ Done! Originals backed up to: ${CONFIG.backupDir}`);
}

// Run script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
