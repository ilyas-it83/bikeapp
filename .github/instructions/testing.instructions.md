---
applyTo: "**/*.test.{js,jsx,ts,tsx}"
---

# Testing Instructions

## Testing Strategy
- Write unit tests for all business logic functions
- Create integration tests for API endpoints
- Implement component testing for React components
- Use end-to-end tests for critical user workflows

## Frontend Testing
- Use Jest and React Testing Library for component tests
- Test user interactions and component behavior
- Mock external dependencies and API calls
- Test accessibility features and keyboard navigation

## Backend Testing
- Use Jest for unit and integration testing
- Test API endpoints with proper request/response validation
- Mock database operations for unit tests
- Test authentication and authorization logic

## Testing Best Practices
- Follow AAA pattern (Arrange, Act, Assert)
- Use descriptive test names that explain the scenario
- Keep tests isolated and independent
- Use setup and teardown functions for test data

## Test Coverage
- Aim for high test coverage on critical business logic
- Prioritize testing error handling and edge cases
- Test both happy path and failure scenarios
- Include performance testing for critical operations

## Cycling-Specific Testing
- Test GPS coordinate processing and route calculation
- Validate activity metrics calculation accuracy
- Test third-party API integration (Strava, Garmin)
- Verify data privacy and security implementations

## Mock Data
- Create realistic cycling activity test data
- Use consistent test user profiles
- Mock GPS coordinates and route data
- Simulate various device and sensor inputs
