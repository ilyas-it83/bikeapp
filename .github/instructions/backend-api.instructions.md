---
applyTo: "server/**/*.{js,ts}"
---

# Backend API Development Instructions (Simplified)

## Simple API Design Principles
- Create simple RESTful endpoints for basic CRUD operations
- Use Express.js for straightforward request handling
- Return JSON responses for all API calls
- Keep API structure simple and predictable

## Basic Server Structure
- Use Express.js with minimal middleware
- Organize routes by feature (activities, routes, users)
- No authentication or authorization required
- Simple error handling with basic JSON responses

## JSON File Data Storage
- Store data in organized JSON files (activities.json, routes.json, etc.)
- Use simple file read/write operations with fs module
- Implement basic data validation before saving
- Handle file operations synchronously for simplicity

## No Authentication Required
- All endpoints are publicly accessible
- No user management or session handling
- No JWT tokens or password security
- Open access for prototype demonstration

## Simple Error Handling
- Use basic try-catch blocks for file operations
- Return simple error messages in JSON format
- Log errors to console for debugging
- Provide meaningful error responses to frontend

## API Documentation
- Use clear, descriptive endpoint names (/api/activities, /api/routes)
- Include basic JSDoc comments for functions
- Document expected request/response formats
- Keep API documentation simple and practical

## Basic Performance
- No complex optimization required
- Simple caching can use in-memory variables
- Basic input validation to prevent crashes
- Straightforward data processing without background jobs
