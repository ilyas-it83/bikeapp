---
applyTo: "**/*.{md,txt,doc}"
---

# User Story Creation Instructions (SMART Style)

## SMART User Story Format
- **S**pecific: Clear and well-defined functionality
- **M**easurable: Includes acceptance criteria that can be tested
- **A**chievable: Realistic scope for implementation
- **R**elevant: Adds value to the cycling companion app
- **T**ime-bound: Can be completed within a sprint/iteration

## Story Structure Template
```
As a [user type], I want [functionality] so that [benefit/value].

Acceptance Criteria:
- [Specific testable condition 1]
- [Specific testable condition 2]
- [Specific testable condition 3]
```

## Writing Guidelines

### Title Requirements
- **Maximum 1 line only**
- Use clear, action-oriented language
- Include the core functionality or feature
- Example: "Track cycling activity with GPS coordinates"

### Description Requirements
- **Maximum 3 lines total**
- Line 1: User role and main action
- Line 2: Expected outcome or benefit
- Line 3: Key constraint or context (if needed)

### Acceptance Criteria Rules
- Maximum 3-5 bullet points
- Each criterion must be testable
- Use specific, measurable language
- Avoid technical jargon in user-facing criteria

## Cycling App User Types
- **Casual Cyclist**: Weekend riders, fitness enthusiasts
- **Competitive Cyclist**: Racing, training-focused users
- **Fitness Enthusiast**: Multi-sport athletes
- **Beginner Cyclist**: New to cycling, learning basics

## Example User Stories

### Good Example:
**Title:** Display cycling route on interactive map

**Description:**
As a casual cyclist, I want to view my planned route on a map.
So that I can visualize the path and identify landmarks.
The map should show elevation changes and distance markers.

**Acceptance Criteria:**
- Route displays as a colored line on the map
- Elevation profile shows below the map
- Distance markers appear every 5km along the route

### Bad Example (Too Long):
**Title:** Create a comprehensive route planning system with advanced features including elevation analysis, weather integration, traffic overlays, and social sharing capabilities for enhanced user experience

**Description:**
As a user of the cycling application, I want to be able to create detailed cycling routes that include multiple waypoints, elevation analysis, real-time weather information, traffic data, and the ability to share these routes with friends and the cycling community, so that I can plan safe and enjoyable cycling trips while staying informed about conditions and sharing my favorite routes with others, and the system should also provide recommendations based on my preferences and past activities.

## Story Sizing Guidelines
- **Small Stories**: Can be completed in 1-2 days
- **Medium Stories**: Can be completed in 3-5 days
- **Large Stories**: Should be broken down into smaller stories

## Common Cycling App Story Categories
- **Activity Tracking**: Recording rides, metrics, GPS data
- **Route Management**: Planning, saving, sharing routes
- **Performance Analytics**: Charts, statistics, progress tracking
- **User Interface**: Navigation, forms, responsive design
- **Data Management**: CRUD operations, file handling
