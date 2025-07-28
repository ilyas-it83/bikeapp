const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Helper functions for file operations
const readJSONFile = (filename) => {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

const writeJSONFile = (filename, data) => {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Badge earning logic
const checkAndAwardBadges = (activities) => {
  const availableBadges = readJSONFile('badges.json');
  const earnedBadges = readJSONFile('user-badges.json');
  const earnedBadgeIds = earnedBadges.map(b => b.badgeId);
  
  // Calculate user statistics
  const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
  const totalElevation = activities.reduce((sum, activity) => sum + activity.elevationGain, 0);
  const activityCount = activities.length;
  
  const newBadges = [];
  
  availableBadges.forEach(badge => {
    if (earnedBadgeIds.includes(badge.id)) return; // Already earned
    
    let earned = false;
    
    switch (badge.criteria.type) {
      case 'activity_count':
        earned = activityCount >= badge.criteria.threshold;
        break;
      case 'total_distance':
        earned = totalDistance >= badge.criteria.threshold;
        break;
      case 'total_elevation':
        earned = totalElevation >= badge.criteria.threshold;
        break;
    }
    
    if (earned) {
      const userBadge = {
        id: uuidv4(),
        badgeId: badge.id,
        earnedDate: new Date().toISOString(),
        badge: badge
      };
      newBadges.push(userBadge);
      earnedBadges.push(userBadge);
    }
  });
  
  if (newBadges.length > 0) {
    writeJSONFile('user-badges.json', earnedBadges);
  }
  
  return newBadges;
};

// Get all available badges
router.get('/', (req, res) => {
  try {
    const badges = readJSONFile('badges.json');
    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// Get user's earned badges
router.get('/earned', (req, res) => {
  try {
    const earnedBadges = readJSONFile('user-badges.json');
    res.json(earnedBadges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch earned badges' });
  }
});

// Check for new badges (called when activities are updated)
router.post('/check', (req, res) => {
  try {
    const activities = readJSONFile('activities.json');
    const newBadges = checkAndAwardBadges(activities);
    res.json({ newBadges });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check badges' });
  }
});

module.exports = router;