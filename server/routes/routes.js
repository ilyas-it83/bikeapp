const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/routes.json');

// Initialize routes data file if it doesn't exist
function initializeDataFile() {
  if (!fs.existsSync(dataPath)) {
    const initialData = { routes: [] };
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
  }
}

// Read routes from JSON file
function readRoutes() {
  try {
    initializeDataFile();
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading routes:', error);
    return { routes: [] };
  }
}

// Write routes to JSON file
function writeRoutes(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing routes:', error);
    return false;
  }
}

// GET /api/routes - Get all routes
router.get('/', (req, res) => {
  try {
    const data = readRoutes();
    res.json(data.routes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// GET /api/routes/:id - Get specific route by ID
router.get('/:id', (req, res) => {
  try {
    const data = readRoutes();
    const route = data.routes.find(r => r.id === req.params.id);
    
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

// POST /api/routes - Create new route
router.post('/', (req, res) => {
  try {
    const { name, description, waypoints, distance, difficulty } = req.body;
    
    // Basic validation
    if (!name || !waypoints || !Array.isArray(waypoints) || waypoints.length < 2) {
      return res.status(400).json({ error: 'Route requires name and at least 2 waypoints' });
    }
    
    const newRoute = {
      id: uuidv4(),
      name: name.trim(),
      description: description ? description.trim() : '',
      waypoints,
      distance: distance || 0,
      difficulty: difficulty || 'Easy',
      createdAt: new Date().toISOString(),
      shareableId: uuidv4() // Unique ID for sharing
    };
    
    const data = readRoutes();
    data.routes.push(newRoute);
    
    if (writeRoutes(data)) {
      res.status(201).json(newRoute);
    } else {
      res.status(500).json({ error: 'Failed to save route' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create route' });
  }
});

// PUT /api/routes/:id - Update existing route
router.put('/:id', (req, res) => {
  try {
    const data = readRoutes();
    const routeIndex = data.routes.findIndex(r => r.id === req.params.id);
    
    if (routeIndex === -1) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    const { name, description, waypoints, distance, difficulty } = req.body;
    
    // Update route while preserving ID and creation date
    data.routes[routeIndex] = {
      ...data.routes[routeIndex],
      name: name?.trim() || data.routes[routeIndex].name,
      description: description?.trim() || data.routes[routeIndex].description,
      waypoints: waypoints || data.routes[routeIndex].waypoints,
      distance: distance || data.routes[routeIndex].distance,
      difficulty: difficulty || data.routes[routeIndex].difficulty,
      updatedAt: new Date().toISOString()
    };
    
    if (writeRoutes(data)) {
      res.json(data.routes[routeIndex]);
    } else {
      res.status(500).json({ error: 'Failed to update route' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update route' });
  }
});

// DELETE /api/routes/:id - Delete route
router.delete('/:id', (req, res) => {
  try {
    const data = readRoutes();
    const routeIndex = data.routes.findIndex(r => r.id === req.params.id);
    
    if (routeIndex === -1) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    data.routes.splice(routeIndex, 1);
    
    if (writeRoutes(data)) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Failed to delete route' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete route' });
  }
});

// GET /api/routes/share/:shareableId - Get route by shareable ID
router.get('/share/:shareableId', (req, res) => {
  try {
    const data = readRoutes();
    const route = data.routes.find(r => r.shareableId === req.params.shareableId);
    
    if (!route) {
      return res.status(404).json({ error: 'Shared route not found' });
    }
    
    // Return route data without personal information
    const sharedRoute = {
      id: route.shareableId,
      name: route.name,
      description: route.description,
      waypoints: route.waypoints,
      distance: route.distance,
      difficulty: route.difficulty,
      createdAt: route.createdAt
    };
    
    res.json(sharedRoute);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shared route' });
  }
});

module.exports = router;