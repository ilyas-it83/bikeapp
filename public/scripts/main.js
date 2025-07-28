// Cycling Companion App - Main JavaScript

// Global state
let currentActivities = [];
let currentRoutes = [];

// DOM elements
const loadDemoButton = document.getElementById('loadDemoData');
const clearDataButton = document.getElementById('clearData');
const demoStatus = document.getElementById('demoStatus');
const activitiesContainer = document.getElementById('activitiesContainer');
const routesContainer = document.getElementById('routesContainer');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚴‍♂️ Cycling Companion App loaded');
    
    loadDemoButton.addEventListener('click', loadDemoData);
    clearDataButton.addEventListener('click', clearAllData);
    
    // Load any existing data on page load
    loadExistingData();
});

// API helper function
async function apiCall(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Load demo data function
async function loadDemoData() {
    try {
        showStatus('Loading demo data...', 'info');
        loadDemoButton.disabled = true;
        
        // Load demo activities and routes in parallel
        const [activitiesResponse, routesResponse] = await Promise.all([
            apiCall('/api/demo/activities'),
            apiCall('/api/demo/routes')
        ]);
        
        if (activitiesResponse.success && routesResponse.success) {
            currentActivities = activitiesResponse.data;
            currentRoutes = routesResponse.data;
            
            renderActivities();
            renderRoutes();
            
            showStatus(
                `✅ Successfully loaded ${activitiesResponse.count} demo activities and ${routesResponse.count} demo routes!`, 
                'success'
            );
        } else {
            throw new Error('Failed to load demo data');
        }
    } catch (error) {
        console.error('Error loading demo data:', error);
        showStatus('❌ Failed to load demo data. Please try again.', 'error');
    } finally {
        loadDemoButton.disabled = false;
    }
}

// Load existing data (if any)
async function loadExistingData() {
    try {
        const [activitiesResponse, routesResponse] = await Promise.all([
            apiCall('/api/activities'),
            apiCall('/api/routes')
        ]);
        
        if (activitiesResponse.success && routesResponse.success) {
            currentActivities = activitiesResponse.data;
            currentRoutes = routesResponse.data;
            
            if (currentActivities.length > 0 || currentRoutes.length > 0) {
                renderActivities();
                renderRoutes();
            }
        }
    } catch (error) {
        console.error('Error loading existing data:', error);
        // Don't show error for initial load, just keep empty state
    }
}

// Clear all data function
function clearAllData() {
    currentActivities = [];
    currentRoutes = [];
    
    renderActivities();
    renderRoutes();
    
    showStatus('🗑️ All data cleared!', 'info');
}

// Show status messages
function showStatus(message, type) {
    demoStatus.textContent = message;
    demoStatus.className = `status-message status-${type}`;
    
    // Auto-hide success and info messages after 5 seconds
    if (type !== 'error') {
        setTimeout(() => {
            demoStatus.textContent = '';
            demoStatus.className = 'status-message';
        }, 5000);
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format duration (seconds) to readable format
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Render activities
function renderActivities() {
    if (currentActivities.length === 0) {
        activitiesContainer.innerHTML = '<p class="empty-state">No activities yet. Load demo data to see sample activities!</p>';
        return;
    }
    
    const activitiesHtml = currentActivities.map(activity => `
        <div class="activity-card">
            ${activity.isDemo ? '<span class="demo-badge">Demo Data</span>' : ''}
            <h3 class="card-title">${activity.name}</h3>
            <p class="card-date">${formatDate(activity.date)}</p>
            
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">${activity.distance} km</div>
                    <div class="metric-label">Distance</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${formatDuration(activity.duration)}</div>
                    <div class="metric-label">Duration</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${activity.averageSpeed} km/h</div>
                    <div class="metric-label">Avg Speed</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${activity.calories}</div>
                    <div class="metric-label">Calories</div>
                </div>
            </div>
        </div>
    `).join('');
    
    activitiesContainer.innerHTML = activitiesHtml;
}

// Render routes
function renderRoutes() {
    if (currentRoutes.length === 0) {
        routesContainer.innerHTML = '<p class="empty-state">No routes yet. Load demo data to see sample routes!</p>';
        return;
    }
    
    const routesHtml = currentRoutes.map(route => `
        <div class="route-card">
            ${route.isDemo ? '<span class="demo-badge">Demo Data</span>' : ''}
            <h3 class="card-title">${route.name}</h3>
            <p class="card-date">${route.description}</p>
            
            <div class="route-info">
                <div>
                    <strong>${route.distance} km</strong> • ${route.terrain}
                </div>
                <span class="difficulty ${route.difficulty.toLowerCase()}">${route.difficulty}</span>
            </div>
        </div>
    `).join('');
    
    routesContainer.innerHTML = routesHtml;
}

// Export functions for potential testing
window.CyclingApp = {
    loadDemoData,
    clearAllData,
    currentActivities,
    currentRoutes
};