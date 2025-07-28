const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load community routes data
const loadRoutes = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../data/community-routes.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading routes data:', error);
    return [];
  }
};

// GET /api/routes - Get all community routes with optional filtering
router.get('/', (req, res) => {
  try {
    let routes = loadRoutes();
    
    // Apply filters
    const { difficulty, minDistance, maxDistance, minRating } = req.query;
    
    if (difficulty) {
      routes = routes.filter(route => 
        route.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }
    
    if (minDistance) {
      routes = routes.filter(route => route.distance >= parseFloat(minDistance));
    }
    
    if (maxDistance) {
      routes = routes.filter(route => route.distance <= parseFloat(maxDistance));
    }
    
    if (minRating) {
      routes = routes.filter(route => route.rating >= parseFloat(minRating));
    }
    
    // Sort by rating (highest first) by default
    routes.sort((a, b) => b.rating - a.rating);
    
    res.json({
      success: true,
      count: routes.length,
      routes: routes
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching routes',
      error: error.message
    });
  }
});

// GET /api/routes/:id - Get specific route details
router.get('/:id', (req, res) => {
  try {
    const routes = loadRoutes();
    const route = routes.find(r => r.id === req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    res.json({
      success: true,
      route: route
    });
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching route details',
      error: error.message
    });
  }
});

module.exports = router;