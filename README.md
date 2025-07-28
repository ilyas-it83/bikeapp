# 🚴‍♂️ Cycling Companion Web App

A simple cycling companion web application for planning, tracking, and sharing cycling routes. Built with Express.js backend and vanilla JavaScript frontend.

## Features

### ✅ Route Management
- Create custom cycling routes by clicking on an interactive map
- Save routes with names, descriptions, and difficulty levels
- View all saved routes in a clean, organized interface
- Real-time distance calculation as you plan your route

### ✅ Shareable Route Links (NEW!)
- **Generate unique shareable links** for any route with a single click
- **Share routes with friends** using simple copy-paste URLs
- **Privacy-focused sharing** - no personal information included in shared routes
- **Dedicated share page** displays route details and map for anyone with the link

### 🚧 Coming Soon
- GPS activity tracking
- Performance analytics
- Social features and challenges

## Technology Stack

### Frontend
- **HTML5/CSS3** with responsive design
- **Vanilla JavaScript** for interactivity
- **Leaflet.js** for interactive maps
- **OpenStreetMap** tiles for map data

### Backend
- **Node.js** with Express.js
- **JSON file storage** for simple data persistence
- **RESTful APIs** for data operations
- **CORS enabled** for cross-origin requests

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ilyas-it83/bikeapp.git
   cd bikeapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## How to Use

### Creating a Route
1. Click "Create New Route" button
2. Click on the map to add waypoints for your route
3. Enter a route name and optional description
4. Click "Save Route" to store your route

### Sharing a Route
1. Click on any saved route card to view details
2. Click the "🔗 Share Route" button
3. Copy the generated shareable link
4. Share the link with friends via any method (email, messaging, social media)

### Viewing Shared Routes
- Anyone with a shared route link can view the route details and map
- No account or login required to view shared routes
- Route information displayed includes name, description, distance, and difficulty
- Interactive map shows the complete route path

## API Endpoints

### Routes API
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Create a new route
- `GET /api/routes/:id` - Get specific route by ID
- `PUT /api/routes/:id` - Update existing route
- `DELETE /api/routes/:id` - Delete route
- `GET /api/routes/share/:shareableId` - Get route by shareable ID (for public sharing)

### Example Route Data Structure
```json
{
  "id": "unique-route-id",
  "name": "Central Park Loop",
  "description": "A scenic loop around Central Park",
  "waypoints": [
    {"lat": 40.7829, "lng": -73.9654, "name": "Start Point"},
    {"lat": 40.7589, "lng": -73.9441, "name": "End Point"}
  ],
  "distance": 10.2,
  "difficulty": "Easy",
  "createdAt": "2025-07-28T10:00:00.000Z",
  "shareableId": "unique-shareable-id"
}
```

## File Structure

```
bikeapp/
├── server/
│   ├── server.js              # Main Express server
│   ├── routes/
│   │   └── routes.js          # Route management API
│   └── data/
│       └── routes.json        # Route data storage
├── public/
│   ├── index.html             # Main application page
│   ├── share.html             # Shared route viewer page
│   ├── css/
│   │   └── main.css           # Application styles
│   └── js/
│       ├── main.js            # Main application logic
│       └── shared-route.js    # Shared route page logic
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## Contributing

This is a prototype application built for demonstration purposes. Feel free to fork and enhance!

### Development Guidelines
- Follow the existing code structure and patterns
- Use vanilla JavaScript for frontend functionality
- Keep the backend simple with JSON file storage
- Maintain responsive design for mobile compatibility
- Test changes across different browsers

## Privacy & Security

- **No user accounts** required - open application for demonstration
- **No personal data collection** - routes are anonymous
- **Shareable routes contain no personal information**
- **Local JSON storage** - no external databases
- **Open source** - all code is transparent and auditable

## License

MIT License - see LICENSE file for details.

## Author

**Ilyas Fakir Mohamed**  
Principal Technical Program Manager

---

🚴‍♂️ **Happy Cycling!** 🚴‍♀️