// Simple manual tests for badge functionality

console.log('🧪 Testing Badge System...');

// Test 1: Check if badges API works
fetch('/api/badges')
  .then(response => response.json())
  .then(badges => {
    console.log('✅ Available badges loaded:', badges.length);
    console.log('Badge types:', badges.map(b => b.type));
  })
  .catch(error => console.error('❌ Failed to load badges:', error));

// Test 2: Check earned badges
fetch('/api/badges/earned')
  .then(response => response.json())
  .then(earnedBadges => {
    console.log('✅ Earned badges loaded:', earnedBadges.length);
    earnedBadges.forEach(badge => {
      console.log(`🏆 ${badge.badge.name} - Earned: ${badge.earnedDate}`);
    });
  })
  .catch(error => console.error('❌ Failed to load earned badges:', error));

// Test 3: Check activity stats
fetch('/api/activities/stats')
  .then(response => response.json())
  .then(stats => {
    console.log('✅ Activity stats loaded:');
    console.log(`📊 Total Activities: ${stats.totalActivities}`);
    console.log(`📏 Total Distance: ${stats.totalDistance}km`);
    console.log(`⛰️ Total Elevation: ${stats.totalElevation}m`);
  })
  .catch(error => console.error('❌ Failed to load stats:', error));

console.log('🏁 Badge tests completed!');