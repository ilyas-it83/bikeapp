// Shared Route Page JavaScript
class SharedRoute {
    constructor() {
        this.route = null;
        this.map = null;
        this.routeId = this.getRouteIdFromUrl();
        
        this.initializePage();
    }

    getRouteIdFromUrl() {
        // Extract route ID from URL path /share/:routeId
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    }

    async initializePage() {
        if (!this.routeId) {
            this.showError();
            return;
        }

        try {
            await this.loadRoute();
        } catch (error) {
            console.error('Error loading route:', error);
            this.showError();
        }
    }

    async loadRoute() {
        try {
            const response = await fetch(`/api/routes/share/${this.routeId}`);
            
            if (!response.ok) {
                throw new Error('Route not found');
            }

            this.route = await response.json();
            this.displayRoute();
        } catch (error) {
            throw error;
        }
    }

    displayRoute() {
        // Hide loading, show content
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('route-content').classList.remove('hidden');

        // Populate route information
        document.getElementById('route-name').textContent = this.route.name;
        document.getElementById('route-distance').textContent = this.route.distance.toFixed(1);
        document.getElementById('route-difficulty').textContent = this.route.difficulty;
        
        // Format and display creation date
        const date = new Date(this.route.createdAt);
        document.getElementById('route-date').textContent = date.toLocaleDateString();

        // Display description
        const descriptionElement = document.getElementById('route-description');
        if (this.route.description && this.route.description.trim()) {
            descriptionElement.innerHTML = `<p>${this.route.description}</p>`;
        } else {
            descriptionElement.innerHTML = '<p><em>No description provided</em></p>';
        }

        // Initialize map
        this.initializeMap();

        // Set up action buttons
        this.setupActions();
    }

    initializeMap() {
        // Initialize map with first waypoint
        const firstWaypoint = this.route.waypoints[0];
        this.map = L.map('shared-route-map').setView([firstWaypoint.lat, firstWaypoint.lng], 12);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add markers for waypoints
        this.route.waypoints.forEach((waypoint, index) => {
            const isStart = index === 0;
            const isEnd = index === this.route.waypoints.length - 1;
            let iconHtml = '📍';
            
            if (isStart) iconHtml = '🏁';
            else if (isEnd && this.route.waypoints.length > 2) iconHtml = '🏁';

            const marker = L.marker([waypoint.lat, waypoint.lng]).addTo(this.map);
            
            // Add popup with waypoint info
            let popupContent = waypoint.name || `Waypoint ${index + 1}`;
            if (isStart) popupContent = '🏁 Start';
            else if (isEnd && this.route.waypoints.length > 2) popupContent = '🏁 Finish';
            
            marker.bindPopup(popupContent);
        });

        // Add route line if there are multiple waypoints
        if (this.route.waypoints.length >= 2) {
            const latLngs = this.route.waypoints.map(wp => [wp.lat, wp.lng]);
            const routeLine = L.polyline(latLngs, { 
                color: '#667eea', 
                weight: 4,
                opacity: 0.8 
            }).addTo(this.map);

            // Fit map to show entire route
            this.map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
        }
    }

    setupActions() {
        // Copy route data button
        document.getElementById('copy-route-btn').addEventListener('click', () => {
            this.copyRouteData();
        });

        // View app button
        document.getElementById('view-app-btn').addEventListener('click', () => {
            window.location.href = '/';
        });
    }

    async copyRouteData() {
        // Create a simplified route data structure for sharing
        const routeData = {
            name: this.route.name,
            description: this.route.description,
            distance: this.route.distance,
            difficulty: this.route.difficulty,
            waypoints: this.route.waypoints.map(wp => ({
                lat: wp.lat,
                lng: wp.lng,
                name: wp.name
            }))
        };

        const routeText = `
Route: ${this.route.name}
Description: ${this.route.description || 'No description'}
Distance: ${this.route.distance.toFixed(1)} km
Difficulty: ${this.route.difficulty}

Waypoints:
${this.route.waypoints.map((wp, i) => `${i + 1}. ${wp.name || 'Waypoint'}: ${wp.lat.toFixed(6)}, ${wp.lng.toFixed(6)}`).join('\n')}

Share Link: ${window.location.href}
        `.trim();

        try {
            await navigator.clipboard.writeText(routeText);
            this.showToast('Route data copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = routeText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Route data copied to clipboard!', 'success');
        }
    }

    showError() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error-content').classList.remove('hidden');
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const messageElement = document.getElementById('toast-message');
        
        messageElement.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// Initialize shared route page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SharedRoute();
});