# 🚴‍♂️ Cycling Companion - GPS Activity Tracker

A simple cycling companion web application for GPS-based activity tracking. This prototype demonstrates core cycling activity tracking functionality with real-time GPS monitoring, route visualization, and activity storage.

## Features

- **GPS-Based Activity Tracking**: Start/stop GPS tracking with one click
- **Real-time Metrics**: Live display of distance, time, speed, and average speed
- **Route Visualization**: Interactive map showing your cycling route in real-time
- **Activity Storage**: Save completed rides with custom names and notes
- **Activity History**: View all your past cycling activities
- **Mobile-Friendly**: Responsive design optimized for mobile devices
- **Offline Capable**: GPS tracking continues even when offline

## Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- Modern web browser with GPS/Geolocation support
- Internet connection for map tiles (OpenStreetMap)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bikeapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Development

For development with auto-restart:
```bash
npm run dev
```

## Usage

### Starting GPS Tracking

1. Open the app in your browser
2. Allow location access when prompted
3. Click the "Start Tracking" button
4. Begin your cycling activity

### During Tracking

- View real-time metrics: distance, time, current speed, average speed
- See your route plotted on the interactive map
- GPS coordinates are recorded automatically every 10 seconds

### Stopping and Saving

1. Click "Stop Tracking" when you finish your ride
2. Enter a name for your activity (auto-generated if left blank)
3. Add optional notes about your ride
4. Click "Save Activity" to store your ride data

### Viewing Activities

1. Click "Activities" in the navigation
2. Browse your complete ride history
3. View detailed statistics for each activity

## Technology Stack

### Frontend
- **HTML5/CSS3**: Responsive web design
- **Vanilla JavaScript**: Simple, dependency-free frontend logic
- **Leaflet.js**: Interactive mapping and route visualization
- **Geolocation API**: Browser-based GPS tracking

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web application framework
- **JSON Files**: Simple file-based data storage
- **CORS**: Cross-origin resource sharing support

### Key APIs
- **Navigator.geolocation**: GPS position tracking
- **OpenStreetMap**: Free map tiles and mapping data

## Architecture

```
/public
  /styles          - CSS stylesheets
  /scripts         - Frontend JavaScript modules
  index.html       - Main application HTML

/server
  /routes          - Express API route handlers
  /data            - JSON data storage files
  server.js        - Main server application

package.json       - Project dependencies and scripts
```

## API Endpoints

### Activities

- `GET /api/activities` - Retrieve all activities
- `POST /api/activities` - Create a new activity
- `GET /api/activities/:id` - Get specific activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Activity Data Model

```json
{
  "id": "unique-id",
  "name": "Morning Ride",
  "date": "2025-07-28",
  "distance": 25.5,
  "duration": 3600,
  "averageSpeed": 25.5,
  "maxSpeed": 45.2,
  "elevationGain": 0,
  "route": [
    {"lat": 40.7128, "lng": -74.0060, "elevation": 0},
    {"lat": 40.7130, "lng": -74.0058, "elevation": 0}
  ],
  "notes": "Great morning ride!",
  "createdAt": "2025-07-28T10:30:00.000Z"
}
```

## Browser Compatibility

- **Chrome 50+**: Full support
- **Firefox 45+**: Full support  
- **Safari 12+**: Full support
- **Edge 79+**: Full support
- **Mobile browsers**: iOS Safari 12+, Chrome Mobile 90+

## Privacy & Security

- **No User Accounts**: Open prototype application
- **Local Data Storage**: All data stored locally in JSON files
- **No External Tracking**: No analytics or user behavior tracking
- **GPS Privacy**: Location data only used for activity tracking

## Limitations

This is a prototype application with the following limitations:

- **No Authentication**: Open access to all features
- **Local Storage Only**: Data stored in local JSON files
- **No Real-time Sync**: No cloud synchronization
- **Basic Elevation**: No real elevation data (requires external APIs)
- **No Social Features**: Individual use only

## Contributing

This is a prototype application for demonstration purposes. For contributions:

1. Follow the existing code style and structure
2. Test GPS functionality on actual devices
3. Ensure mobile responsiveness
4. Update documentation for any new features

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues:
- Review the console logs for debugging information
- Ensure GPS/location services are enabled
- Check browser compatibility
- Verify internet connection for map tiles

---

**Note**: This is a prototype application designed for demonstration and learning purposes. It showcases core cycling activity tracking functionality using modern web technologies.