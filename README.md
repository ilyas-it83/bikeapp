# Cycling Companion Web App

A comprehensive cycling companion web application designed for cycling enthusiasts to discover, share, and explore community-shared cycling routes.

## Features

### 🗺️ Community Route Discovery
- Browse community-shared cycling routes with ratings and difficulty levels
- Filter routes by difficulty, distance range, and minimum rating
- View detailed route information including elevation profiles and descriptions
- Interactive route details with maps and statistics

### 📊 Route Information
- **Comprehensive Route Data**: Distance, difficulty, elevation gain, surface type, traffic level
- **User Ratings**: Community ratings and review counts
- **Route Tags**: Categorized tags for easy discovery (scenic, beginner-friendly, challenging, etc.)
- **Creator Information**: See who shared each route

### 🎯 Filtering & Discovery
- Filter by difficulty level (Easy, Intermediate, Hard)
- Filter by distance range (minimum and maximum)
- Filter by minimum rating (3.0+ to 4.5+ stars)
- Routes sorted by rating by default

### 📱 Responsive Design
- Mobile-first responsive design
- Works seamlessly on desktop, tablet, and mobile devices
- Touch-friendly interface for mobile users

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with Flexbox/Grid layouts
- **Vanilla JavaScript**: No framework dependencies for simplicity
- **Responsive Design**: Mobile-first approach with CSS media queries

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework for API endpoints
- **JSON Files**: Simple file-based data storage
- **CORS**: Cross-origin resource sharing enabled

### Data Storage
- **JSON Files**: Community routes stored in structured JSON format
- **File System**: Simple read/write operations using Node.js fs module
- **No Database**: Simplified prototype using JSON for data persistence

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ilyas-it83/bikeapp.git
   cd bikeapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
bikeapp/
├── package.json                 # Project dependencies and scripts
├── server.js                   # Main Express server
├── server/
│   ├── routes/
│   │   └── routes.js           # API routes for community routes
│   └── data/
│       └── community-routes.json # Sample community route data
├── public/
│   ├── index.html              # Homepage
│   ├── routes.html             # Community routes listing page
│   ├── route-details.html      # Individual route details page
│   ├── styles/
│   │   └── main.css            # Main stylesheet
│   └── scripts/
│       ├── main.js             # Common JavaScript utilities
│       ├── routes.js           # Routes listing functionality
│       └── route-details.js    # Route details functionality
└── README.md                   # This file
```

## API Endpoints

### Get All Routes
```
GET /api/routes
```
**Query Parameters:**
- `difficulty`: Filter by difficulty (Easy, Intermediate, Hard)
- `minDistance`: Minimum distance in kilometers
- `maxDistance`: Maximum distance in kilometers  
- `minRating`: Minimum rating (3.0, 3.5, 4.0, 4.5)

**Example:**
```
GET /api/routes?difficulty=Easy&minRating=4.0
```

### Get Route Details
```
GET /api/routes/:id
```
**Parameters:**
- `id`: Route ID (e.g., route-001)

**Example:**
```
GET /api/routes/route-001
```

## Sample Data

The application includes 6 sample community routes:

1. **Central Park Loop** (Easy, 10.2km) - Scenic urban park loop
2. **Hudson River Greenway** (Easy, 22.4km) - Waterfront dedicated path
3. **Brooklyn Bridge to Williamsburg** (Intermediate, 15.7km) - Urban bridge route
4. **Bear Mountain Challenge** (Hard, 35.2km) - Mountain climbing route
5. **Coastal Highway Ride** (Intermediate, 28.9km) - Coastal scenic route
6. **Country Roads Loop** (Easy, 18.3km) - Rural family-friendly route

## Usage

### Browsing Routes
1. Visit the homepage at `http://localhost:3000`
2. Click "Browse Routes" to view community routes
3. Use filters to find routes matching your preferences
4. Click "View Details" on any route for more information

### Filtering Routes
- **Difficulty**: Select Easy, Intermediate, or Hard
- **Distance Range**: Enter minimum and maximum distances
- **Rating**: Choose minimum rating threshold
- Click "Apply Filters" to update results

### Viewing Route Details
- Click "View Details" on any route card
- View comprehensive route statistics
- See route tags and creator information
- Check elevation profile
- Use "Share Route" button to copy route link

## Development

### Adding New Routes
1. Edit `server/data/community-routes.json`
2. Add route object with required fields:
   - `id`, `name`, `description`, `distance`, `difficulty`
   - `rating`, `ratingCount`, `creator`, `tags`
   - `waypoints`, `elevationProfile`, `totalElevationGain`
   - `surface`, `traffic`

### Customizing Styles
- Edit `public/styles/main.css` for styling changes
- CSS custom properties defined in `:root` for easy theming
- Responsive breakpoints: 768px (tablet), 480px (mobile)

### API Development
- Routes defined in `server/routes/routes.js`
- Simple JSON file operations using Node.js `fs` module
- Basic error handling and validation

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight: No external dependencies for core functionality
- Fast loading: Minimal JavaScript and CSS
- Responsive images: Optimized for different screen sizes
- Simple caching: Basic browser caching for static assets

## Future Enhancements

- Interactive maps with Leaflet.js integration
- User authentication and personal route creation
- Route sharing via social media
- GPS integration for real-time tracking
- Advanced filtering options
- Route difficulty calculation algorithms
- Community reviews and comments

## Contributing

This is a prototype cycling companion application. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Contact

**Ilyas Fakir Mohamed**  
Principal Technical Program Manager  

---

*This is a prototype cycling community platform designed to demonstrate community route discovery features.*