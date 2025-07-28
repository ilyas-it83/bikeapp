# 🚴 Cycling Companion Web App

A cycling companion web application designed for cycling enthusiasts to plan, track, and analyze their cycling workouts with a comprehensive badge system for motivation.

## 🏆 Badge System

The app includes a motivational badge system that recognizes cycling achievements and milestones:

### Available Badges

1. **🚴 First Ride** - Complete your first cycling activity
2. **🏃 50km Explorer** - Cycle a total distance of 50 kilometers
3. **🚵 Century Rider** - Cycle a total distance of 100 kilometers  
4. **🏆 Distance Master** - Cycle a total distance of 500 kilometers
5. **⛰️ Hill Climber** - Gain 500 meters of total elevation
6. **🏔️ Mountain Conqueror** - Gain 1000 meters of total elevation

### Badge Features

- **Automatic Badge Earning**: Badges are automatically awarded when criteria are met
- **Progress Tracking**: See your progress toward unearned badges with visual progress bars
- **Badge Collection Page**: View all earned and available badges in one place
- **Achievement Recognition**: Each badge displays when it was earned
- **Visual Design**: Clean, card-based interface with emoji icons and progress indicators

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ilyas-it83/bikeapp.git
cd bikeapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

4. Open your browser to `http://localhost:3000`

## 📁 Project Structure

```
/server                 # Backend Express.js application
  /routes              # API route handlers
    badges.js          # Badge management endpoints
    activities.js      # Activity tracking endpoints
  /data                # JSON data storage
    badges.json        # Available badge definitions
    user-badges.json   # User's earned badges
    activities.json    # User's cycling activities
  app.js               # Main server application

/public                # Frontend application
  /styles              # CSS styling files
  /scripts             # JavaScript application logic
  index.html           # Main application interface

/tests                 # Test files
```

## 🔧 API Endpoints

### Badge Management
- `GET /api/badges` - Get all available badges
- `GET /api/badges/earned` - Get user's earned badges
- `POST /api/badges/check` - Check for newly earned badges

### Activity Tracking
- `GET /api/activities` - Get all user activities
- `POST /api/activities` - Add a new activity
- `GET /api/activities/stats` - Get activity statistics

## 🎯 Features Implemented

- ✅ Badge collection page displays earned achievements
- ✅ First ride badge unlocks after completing initial activity
- ✅ Distance milestone badges for 50km, 100km, 500km totals
- ✅ Climbing badges for elevation gain achievements
- ✅ Progress tracking with visual progress bars
- ✅ Automatic badge earning based on activity data
- ✅ Clean, responsive web interface
- ✅ Simple JSON file data storage

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Data Storage**: JSON files
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Icons**: Emoji-based icons for badges

## 📸 Screenshots

![Badge Collection Page](https://github.com/user-attachments/assets/3970bd63-02c1-44a8-83f9-b50579b235e4)

The badge collection page showing earned badges with visual progress indicators for remaining achievements.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.