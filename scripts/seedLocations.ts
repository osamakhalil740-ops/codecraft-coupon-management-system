/**
 * Seed Location Data Script
 * 
 * Run this to pre-populate the location cache
 * 
 * Usage:
 *   npm run seed-locations
 * 
 * Or with tsx:
 *   npx tsx scripts/seedLocations.ts
 */

import { seedAll, estimateSeedingTime } from '../utils/seedLocationCache';

async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🌍 Location Cache Seeding Utility       ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log('This will pre-populate your Firebase cache with:');
  console.log('  ✓ All 195+ countries');
  console.log('  ✓ All cities for 25 priority countries');
  console.log('  ✓ All districts for 50 major cities');
  console.log('');
  console.log(`⏰ Estimated time: ${estimateSeedingTime()}`);
  console.log('');
  console.log('Press Ctrl+C to cancel...');
  console.log('');
  
  // Wait 5 seconds to allow user to cancel
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('🚀 Starting seeding process...\n');
  
  try {
    await seedAll((progress) => {
      const percentage = Math.round((progress.completed / progress.total) * 100);
      console.log(`[${percentage}%] ${progress.current}`);
      
      if (progress.errors.length > 0) {
        console.log(`   ⚠️ ${progress.errors.length} errors so far`);
      }
    });
    
    console.log('\n✅ Seeding completed successfully!');
    console.log('🎉 Your location cache is now ready for production use.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    console.error('Please check your GeoNames API setup and try again.');
    process.exit(1);
  }
}

main();
