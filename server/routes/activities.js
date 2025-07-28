const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_FILE = path.join(__dirname, '../data/activities.json');

// Ensure data directory and file exist
function ensureDataFile() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Read activities from JSON file
function readActivities() {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading activities:', error);
    return [];
  }
}

// Write activities to JSON file
function writeActivities(activities) {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(activities, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing activities:', error);
    return false;
  }
}

// Generate unique ID
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// GET /api/activities - Get all activities
router.get('/', (req, res) => {
  try {
    const activities = readActivities();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// GET /api/activities/:id - Get single activity
router.get('/:id', (req, res) => {
  try {
    const activities = readActivities();
    const activity = activities.find(a => a.id === req.params.id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// POST /api/activities - Create new activity
router.post('/', (req, res) => {
  try {
    const { name, date, distance, duration, averageSpeed, maxSpeed, elevationGain, route } = req.body;
    
    // Basic validation
    if (!name || !date || distance === undefined || duration === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name, date, distance, duration' });
    }

    const activities = readActivities();
    const newActivity = {
      id: generateId(),
      name,
      date,
      distance: parseFloat(distance),
      duration: parseInt(duration),
      averageSpeed: parseFloat(averageSpeed) || 0,
      maxSpeed: parseFloat(maxSpeed) || 0,
      elevationGain: parseFloat(elevationGain) || 0,
      route: route || [],
      createdAt: new Date().toISOString()
    };

    activities.push(newActivity);
    
    if (writeActivities(activities)) {
      res.status(201).json(newActivity);
    } else {
      res.status(500).json({ error: 'Failed to save activity' });
    }
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// PUT /api/activities/:id - Update activity
router.put('/:id', (req, res) => {
  try {
    const activities = readActivities();
    const index = activities.findIndex(a => a.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Update activity with provided fields
    activities[index] = { ...activities[index], ...req.body, updatedAt: new Date().toISOString() };
    
    if (writeActivities(activities)) {
      res.json(activities[index]);
    } else {
      res.status(500).json({ error: 'Failed to update activity' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// DELETE /api/activities/:id - Delete activity
router.delete('/:id', (req, res) => {
  try {
    const activities = readActivities();
    const filteredActivities = activities.filter(a => a.id !== req.params.id);
    
    if (filteredActivities.length === activities.length) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    if (writeActivities(filteredActivities)) {
      res.json({ message: 'Activity deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete activity' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

module.exports = router;