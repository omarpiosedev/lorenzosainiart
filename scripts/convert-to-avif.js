/**
 * Bulk AVIF Conversion Script
 * Converts all images in a directory to AVIF format using Sharp
 */

const sharp = require('sharp');
const fs = require('node:fs').promises;
const path = require('node:path');

const INPUT_DIR = path.join(__dirname, '../public/assets/images/allimages');
const OUTPUT_DIR = path.join(__dirname, '../public/assets/images/allimages-avif');

// AVIF conversion settings
const AVIF_OPTIONS = {
  quality: 80, // 80 = high quality, good compression
  effort: 4, // 0-9, higher = better compression but slower (4 = balanced)
  chromaSubsampling: '4:4:4', // Better quality for photos
};

// Supported input formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

async function convertToAvif(inputPath, outputPath) {
  try {
    const startTime = Date.now();
    const stats = await fs.stat(inputPath);
    const originalSize = stats.size;

    await sharp(inputPath)
      .avif(AVIF_OPTIONS)
      .toFile(outputPath);

    const newStats = await fs.stat(outputPath);
    const newSize = newStats.size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    const timeTaken = Date.now() - startTime;

    return {
      success: true,
      originalSize,
      newSize,
      savings: `${savings}%`,
      time: `${timeTaken}ms`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function main() {
  console.log('🚀 Starting bulk AVIF conversion...\n');
  console.log(`📁 Input:  ${INPUT_DIR}`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  // Create output directory
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (error) {
    console.error('❌ Error creating output directory:', error.message);
    process.exit(1);
  }

  // Read all files
  let files;
  try {
    files = await fs.readdir(INPUT_DIR);
  } catch (error) {
    console.error('❌ Error reading input directory:', error.message);
    process.exit(1);
  }

  // Filter supported images
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return SUPPORTED_FORMATS.includes(ext);
  });

  console.log(`Found ${imageFiles.length} images to convert\n`);

  if (imageFiles.length === 0) {
    console.log('⚠️  No images found to convert');
    return;
  }

  // Convert all images
  let successCount = 0;
  let failCount = 0;
  let totalOriginalSize = 0;
  let totalNewSize = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const inputPath = path.join(INPUT_DIR, file);
    const outputFileName = `${path.parse(file).name}.avif`;
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    process.stdout.write(`[${i + 1}/${imageFiles.length}] Converting ${file}... `);

    const result = await convertToAvif(inputPath, outputPath);

    if (result.success) {
      successCount++;
      totalOriginalSize += result.originalSize;
      totalNewSize += result.newSize;
      console.log(`✅ ${result.savings} smaller (${result.time})`);
    } else {
      failCount++;
      console.log(`❌ Failed: ${result.error}`);
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 CONVERSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed:     ${failCount}`);

  if (successCount > 0) {
    const totalSavings = ((1 - totalNewSize / totalOriginalSize) * 100).toFixed(1);
    const originalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
    const newMB = (totalNewSize / 1024 / 1024).toFixed(2);
    const savedMB = (originalMB - newMB).toFixed(2);

    console.log(`\n📦 Original size: ${originalMB} MB`);
    console.log(`📦 New size:      ${newMB} MB`);
    console.log(`💾 Space saved:   ${savedMB} MB (${totalSavings}%)`);
  }

  console.log('\n✨ Done!');
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
