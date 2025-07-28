# Cycling Companion Web App - Repository Instructions

## Project Overview

This project is a comprehensive cycling companion web application designed for cycling enthusiasts to plan, track, and analyze their cycling workouts. The platform offers personalized training plans, route management, performance analytics, and social features to foster community engagement among cyclists.

**Primary Goals:**
- Enable detailed cycling activity tracking with comprehensive metrics
- Provide customizable workout plans based on user goals (endurance, weight loss, race preparation)
- Offer intelligent route planning and discovery with elevation, traffic, and weather overlays
- Deliver advanced performance analytics and progress tracking
- Foster cycling community through challenges, leaderboards, and social sharing

**Target Users:**
- Casual cyclists seeking fitness tracking and motivation
- Competitive cyclists requiring advanced analytics and structured training
- Fitness enthusiasts integrating cycling into broader fitness regimens

## Technical Architecture (Simplified Prototype)

### Frontend Stack (Simple)
- **Framework:** Simple HTML, CSS, and vanilla JavaScript (or basic React.js)
- **Styling:** CSS3 with Flexbox/Grid for responsive design
- **Maps:** Leaflet.js (free, open-source) or basic Google Maps embed
- **Charts:** Chart.js for simple performance visualizations
- **State Management:** Simple DOM manipulation or basic React useState

### Backend Stack (Simple)
- **Runtime:** Node.js with Express.js for basic web server
- **Database:** JSON files for data storage (no MongoDB)
- **Authentication:** No authentication system (open prototype)
- **APIs:** Simple RESTful APIs returning JSON data

### Infrastructure (Basic)
- **Hosting:** Simple hosting service (Netlify, Vercel, or basic VPS)
- **Security:** Basic HTTPS through hosting provider, no complex security
- **Deployment:** Simple git-based deployment or FTP upload

## Folder Structure (Expected - Simplified)

```
/src                    # Frontend application source (simple)
  /components          # Simple HTML/CSS/JS components
  /styles             # CSS files for styling
  /scripts            # JavaScript files
  /assets             # Static assets (images, icons)
/server                # Backend Node.js application (simple)
  /routes             # Express route handlers
  /data               # JSON data files
  /utils              # Utility functions
/public               # Public static files
/docs                 # Project documentation
```

## Core Features & Requirements

### Activity Tracking
- GPS-based ride tracking with real-time metrics
- Comprehensive metrics: distance, speed, elevation gain, heart rate, cadence
- Wearable device synchronization (Garmin, Apple Watch, Fitbit)
- Automatic activity detection and classification

### Workout Plans
- Pre-built training plans (beginner, intermediate, advanced)
- Custom plan builder with workout customization
- Calendar integration for scheduling and reminders
- Progress tracking with adaptive recommendations

### Route Management
- Interactive route planner with map overlays (elevation, traffic, weather)
- Route saving, sharing, and discovery features
- Popular routes recommendation based on location and preferences
- GPX file import/export functionality

### Performance Analytics
- Weekly and monthly performance summaries
- Personal bests tracking and trend analysis
- VO2 max estimation algorithms
- Power zone analysis for advanced cyclists

### Social & Community Features
- Cycling challenges (distance, elevation, time-based)
- Regional and category-based leaderboards
- Social networking (follow friends, comment on activities)
- Social media integration for achievement sharing

### User Profile & Settings
- Personal goal setting and preference management
- Comprehensive privacy controls
- Equipment tracking and maintenance logs
- Profile customization and statistics

## Coding Standards & Conventions (Simplified)

### JavaScript/Frontend Standards
- Use modern ES6+ syntax with simple functions
- Use vanilla JavaScript or basic React functional components
- Keep code simple and readable
- Use camelCase naming convention for variables and functions
- Comment complex logic for clarity

### Node.js/Express Standards (Simple)
- Use async/await for file operations when needed
- Implement basic error handling with try-catch blocks
- Keep route handlers simple and focused
- Use simple JSON responses for all APIs
- Follow basic RESTful API naming conventions

### JSON Data Storage Standards
- Use simple JSON file structure for data persistence
- Implement basic data validation before saving
- Use consistent property names across data objects
- Keep data structure flat and simple to understand

### Code Quality (Basic)
- Use consistent indentation (2 spaces)
- Write clear, descriptive function and variable names
- Add comments for complex logic
- Keep functions small and focused
- Test functionality manually during development

## API Integration Guidelines

### External API Usage
- Implement proper error handling for third-party API failures
- Use environment variables for API keys and sensitive configurations
- Implement rate limiting and caching strategies
- Follow OAuth 2.0 flow for Strava and Garmin integrations
- Handle API versioning and deprecation gracefully

### Internal API Design
- Follow RESTful conventions for endpoint naming
- Implement proper request validation and sanitization
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Implement pagination for large data sets
- Use consistent response formats and error codes

## Security & Privacy Guidelines (Simplified)

### No Authentication Required
- Open application for prototype demonstration
- No user accounts or password management
- Public access to all features and data
- Clear disclaimer that this is a prototype application

### Basic Data Protection
- Use simple JSON file storage
- No encryption required for prototype
- Basic input validation to prevent crashes
- Avoid collecting sensitive personal information

### Simple Privacy Approach
- No user tracking or analytics required
- Use demo/sample data for testing
- Clear indication this is a prototype application
- No complex privacy policies needed

## Performance Optimization

### Frontend Performance
- Implement code splitting and lazy loading
- Optimize images and assets for web delivery
- Use React.memo and useMemo for expensive computations
- Implement proper caching strategies
- Minimize bundle size and optimize loading times

### Backend Performance
- Implement database query optimization
- Use appropriate indexing strategies
- Implement caching for frequently accessed data
- Monitor and log performance metrics
- Use compression for API responses

## Testing Strategy

### Frontend Testing
- Unit tests for components using Jest and React Testing Library
- Integration tests for user workflows
- End-to-end tests for critical user journeys
- Accessibility testing for WCAG compliance

### Backend Testing
- Unit tests for business logic and utilities
- Integration tests for API endpoints
- Database integration tests
- Load testing for performance validation

## Development Workflow

### Version Control
- Use meaningful commit messages following conventional commits
- Create feature branches for new functionality
- Use pull requests for code review process
- Maintain clean git history with proper rebasing

### Environment Management
- Use environment variables for configuration
- Maintain separate environments (development, staging, production)
- Implement proper CI/CD pipeline
- Use Docker for consistent development environments

## UI/UX Guidelines

### Design Principles
- Implement responsive design for all screen sizes
- Follow accessibility best practices (WCAG 2.1)
- Use consistent color scheme and typography
- Implement dark/light mode toggle functionality
- Design for mobile-first approach

### User Experience
- Provide clear feedback for user actions
- Implement loading states for asynchronous operations
- Use intuitive navigation and information architecture
- Provide helpful error messages and recovery options
- Optimize for performance on mobile devices

## Documentation Requirements

- Maintain comprehensive README with setup instructions
- Document API endpoints with examples
- Provide component documentation with prop types
- Include deployment and configuration guides
- Maintain changelog for version tracking
