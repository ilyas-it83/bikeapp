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

// Get all activities
router.get('/', (req, res) => {
  try {
    const activities = readJSONFile('activities.json');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Add new activity
router.post('/', (req, res) => {
  try {
    const activities = readJSONFile('activities.json');
    const newActivity = {
      id: uuidv4(),
      ...req.body,
      date: new Date().toISOString().split('T')[0]
    };
    
    activities.push(newActivity);
    
    if (writeJSONFile('activities.json', activities)) {
      res.status(201).json(newActivity);
    } else {
      res.status(500).json({ error: 'Failed to save activity' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// Get activity statistics
router.get('/stats', (req, res) => {
  try {
    const activities = readJSONFile('activities.json');
    
    const stats = {
      totalActivities: activities.length,
      totalDistance: activities.reduce((sum, activity) => sum + activity.distance, 0),
      totalElevation: activities.reduce((sum, activity) => sum + activity.elevationGain, 0),
      totalDuration: activities.reduce((sum, activity) => sum + activity.duration, 0),
      averageSpeed: activities.length > 0 
        ? activities.reduce((sum, activity) => sum + activity.averageSpeed, 0) / activities.length 
        : 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate statistics' });
  }
});

module.exports = router;