const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Utility function to read JSON files
function readJsonFile(filename) {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

// API Routes
app.get('/api/demo/activities', (req, res) => {
  try {
    const activities = readJsonFile('activities.json');
    const demoActivities = activities.filter(activity => activity.isDemo);
    res.json({
      success: true,
      message: 'Demo activities loaded successfully',
      data: demoActivities,
      count: demoActivities.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading demo activities',
      error: error.message
    });
  }
});

app.get('/api/demo/routes', (req, res) => {
  try {
    const routes = readJsonFile('routes.json');
    const demoRoutes = routes.filter(route => route.isDemo);
    res.json({
      success: true,
      message: 'Demo routes loaded successfully',
      data: demoRoutes,
      count: demoRoutes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading demo routes',
      error: error.message
    });
  }
});

app.get('/api/activities', (req, res) => {
  try {
    const activities = readJsonFile('activities.json');
    res.json({
      success: true,
      data: activities,
      count: activities.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading activities',
      error: error.message
    });
  }
});

app.get('/api/routes', (req, res) => {
  try {
    const routes = readJsonFile('routes.json');
    res.json({
      success: true,
      data: routes,
      count: routes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading routes',
      error: error.message
    });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚴‍♂️ Cycling Companion server running on port ${PORT}`);
  console.log(`📱 Access the app at http://localhost:${PORT}`);
});

module.exports = app;