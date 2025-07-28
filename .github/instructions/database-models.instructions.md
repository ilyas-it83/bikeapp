---
applyTo: "server/models/**/*.{js,ts}"
---

# Data Models and JSON File Structure Instructions

## JSON File Data Storage
- Use simple JSON files for data persistence
- Organize data into separate files (activities.json, routes.json, etc.)
- Use arrays of objects for collections
- Keep file structure simple and readable

## Simple Data Validation
- Implement basic validation using JavaScript
- Check required fields before saving data
- Use simple type checking (string, number, boolean)
- Provide meaningful error messages for validation failures

## Data Structure Design
- Use clear, descriptive property names
- Keep nested objects shallow for simplicity
- Use consistent data types across similar objects
- Include timestamp fields for created/updated dates

## File Organization
- Create separate JSON files for different data types
- Use descriptive file names (user-activities.json, cycling-routes.json)
- Organize files in a logical folder structure
- Keep backup copies of important data files

## No Complex Relationships
- Use simple object references by ID
- Avoid complex nested relationships
- Keep data denormalized for easy access
- Use simple array operations for data queries

## Basic CRUD Operations
- Implement simple functions for Create, Read, Update, Delete
- Use Node.js fs module for file operations
- Handle file operations with basic error checking
- Use JSON.parse() and JSON.stringify() for data conversion

## Cycling-Specific Data Models

### Activity/Ride Data Structure
```json
{
  "id": "unique-id",
  "name": "Morning Ride",
  "date": "2025-07-28",
  "distance": 25.5,
  "duration": 3600,
  "averageSpeed": 25.5,
  "maxSpeed": 45.2,
  "elevationGain": 350,
  "calories": 800,
  "route": [
    {"lat": 40.7128, "lng": -74.0060, "elevation": 10},
    {"lat": 40.7130, "lng": -74.0058, "elevation": 12}
  ]
}
```

### Route Data Structure
```json
{
  "id": "route-id",
  "name": "Central Park Loop",
  "description": "Scenic loop around Central Park",
  "distance": 10.2,
  "difficulty": "Easy",
  "waypoints": [
    {"lat": 40.7829, "lng": -73.9654, "name": "Start Point"},
    {"lat": 40.7589, "lng": -73.9441, "name": "End Point"}
  ],
  "elevationProfile": [
    {"distance": 0, "elevation": 15},
    {"distance": 5.1, "elevation": 25},
    {"distance": 10.2, "elevation": 15}
  ]
}
```

### Simple User Data (if needed)
```json
{
  "id": "user-id",
  "name": "Demo User",
  "preferences": {
    "units": "metric",
    "defaultDistance": 20,
    "difficulty": "intermediate"
  },
  "stats": {
    "totalDistance": 500.5,
    "totalRides": 25,
    "averageSpeed": 22.3
  }
}
```
