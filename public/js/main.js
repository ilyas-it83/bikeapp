// Main Application JavaScript
class CyclingApp {
    constructor() {
        this.currentRoute = null;
        this.routes = [];
        this.map = null;
        this.routeLine = null;
        this.waypoints = [];
        this.markers = [];
        
        this.initializeApp();
    }

    initializeApp() {
        // Set up navigation
        this.setupNavigation();
        
        // Set up route planner
        this.setupRoutePlanner();
        
        // Set up modals
        this.setupModals();
        
        // Load routes
        this.loadRoutes();

        // Initialize demo data
        this.initializeDemoData();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.showSection(section);
                
                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    showSection(sectionName) {
        const sections = document.querySelectorAll('.app-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    setupRoutePlanner() {
        const createBtn = document.getElementById('create-route-btn');
        const saveBtn = document.getElementById('save-route-btn');
        const cancelBtn = document.getElementById('cancel-route-btn');
        const planner = document.getElementById('route-planner');

        createBtn.addEventListener('click', () => {
            this.showRoutePlanner();
        });

        saveBtn.addEventListener('click', () => {
            this.saveRoute();
        });

        cancelBtn.addEventListener('click', () => {
            this.hideRoutePlanner();
        });
    }

    showRoutePlanner() {
        const planner = document.getElementById('route-planner');
        planner.classList.remove('hidden');
        
        // Initialize map if not already done
        if (!this.map) {
            this.initializeMap();
        }
        
        // Clear previous route
        this.clearRoute();
    }

    hideRoutePlanner() {
        const planner = document.getElementById('route-planner');
        planner.classList.add('hidden');
        
        // Clear form
        document.getElementById('route-name').value = '';
        document.getElementById('route-description').value = '';
        
        this.clearRoute();
    }

    initializeMap() {
        // Initialize the map centered on a default location
        this.map = L.map('route-map').setView([40.7128, -74.0060], 12);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add click event for waypoints
        this.map.on('click', (e) => {
            this.addWaypoint(e.latlng);
        });
    }

    addWaypoint(latlng) {
        // Add marker
        const marker = L.marker([latlng.lat, latlng.lng]).addTo(this.map);
        this.markers.push(marker);
        
        // Add to waypoints
        this.waypoints.push({
            lat: latlng.lat,
            lng: latlng.lng,
            name: `Waypoint ${this.waypoints.length + 1}`
        });

        // Update route line
        this.updateRouteLine();
        
        // Update distance
        this.updateRouteDistance();
    }

    updateRouteLine() {
        // Remove existing line
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
        }

        // Create new line if we have at least 2 waypoints
        if (this.waypoints.length >= 2) {
            const latLngs = this.waypoints.map(wp => [wp.lat, wp.lng]);
            this.routeLine = L.polyline(latLngs, { color: '#667eea', weight: 4 }).addTo(this.map);
        }
    }

    updateRouteDistance() {
        let totalDistance = 0;
        
        for (let i = 1; i < this.waypoints.length; i++) {
            const prev = this.waypoints[i - 1];
            const curr = this.waypoints[i];
            totalDistance += this.calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
        }
        
        document.getElementById('route-distance').textContent = totalDistance.toFixed(1);
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    clearRoute() {
        this.waypoints = [];
        
        // Remove markers
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
        
        // Remove route line
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
            this.routeLine = null;
        }
        
        // Reset distance
        document.getElementById('route-distance').textContent = '0.0';
    }

    async saveRoute() {
        const name = document.getElementById('route-name').value.trim();
        const description = document.getElementById('route-description').value.trim();
        
        if (!name) {
            this.showToast('Please enter a route name', 'error');
            return;
        }
        
        if (this.waypoints.length < 2) {
            this.showToast('Please add at least 2 waypoints', 'error');
            return;
        }

        const routeData = {
            name,
            description,
            waypoints: this.waypoints,
            distance: parseFloat(document.getElementById('route-distance').textContent),
            difficulty: 'Easy' // Default difficulty
        };

        try {
            const response = await fetch('/api/routes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(routeData)
            });

            if (response.ok) {
                const savedRoute = await response.json();
                this.showToast('Route saved successfully!', 'success');
                this.hideRoutePlanner();
                this.loadRoutes(); // Refresh routes list
            } else {
                this.showToast('Failed to save route', 'error');
            }
        } catch (error) {
            console.error('Error saving route:', error);
            this.showToast('Error saving route', 'error');
        }
    }

    async loadRoutes() {
        try {
            const response = await fetch('/api/routes');
            if (response.ok) {
                this.routes = await response.json();
                this.displayRoutes();
            }
        } catch (error) {
            console.error('Error loading routes:', error);
        }
    }

    displayRoutes() {
        const container = document.getElementById('routes-container');
        
        if (this.routes.length === 0) {
            container.innerHTML = '<p class="no-routes">No routes yet. Create your first route!</p>';
            return;
        }

        container.innerHTML = this.routes.map(route => `
            <div class="route-card" data-route-id="${route.id}">
                <h4>${route.name}</h4>
                <p>${route.description || 'No description'}</p>
                <div class="route-meta">
                    <span class="route-stat">📏 ${route.distance.toFixed(1)} km</span>
                    <span class="route-stat">⚡ ${route.difficulty}</span>
                    <span class="route-stat">📅 ${new Date(route.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.route-card').forEach(card => {
            card.addEventListener('click', () => {
                const routeId = card.dataset.routeId;
                this.showRouteDetails(routeId);
            });
        });
    }

    showRouteDetails(routeId) {
        const route = this.routes.find(r => r.id === routeId);
        if (!route) return;

        this.currentRoute = route;

        // Populate modal
        document.getElementById('modal-route-name').textContent = route.name;
        document.getElementById('modal-route-description').textContent = route.description || 'No description';
        document.getElementById('modal-route-distance').textContent = route.distance.toFixed(1);
        document.getElementById('modal-route-difficulty').textContent = route.difficulty;

        // Show modal
        document.getElementById('route-modal').classList.remove('hidden');

        // Initialize modal map
        setTimeout(() => {
            this.initializeModalMap(route);
        }, 100);
    }

    initializeModalMap(route) {
        const mapContainer = document.getElementById('modal-route-map');
        
        // Clear any existing map
        mapContainer.innerHTML = '';
        
        // Create new map
        const modalMap = L.map('modal-route-map').setView([route.waypoints[0].lat, route.waypoints[0].lng], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(modalMap);

        // Add waypoints and route line
        route.waypoints.forEach((wp, index) => {
            L.marker([wp.lat, wp.lng]).addTo(modalMap);
        });

        if (route.waypoints.length >= 2) {
            const latLngs = route.waypoints.map(wp => [wp.lat, wp.lng]);
            L.polyline(latLngs, { color: '#667eea', weight: 4 }).addTo(modalMap);
            
            // Fit map to route bounds
            modalMap.fitBounds(latLngs);
        }
    }

    setupModals() {
        // Route detail modal
        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('route-modal').classList.add('hidden');
        });

        // Share modal
        document.getElementById('close-share-modal').addEventListener('click', () => {
            document.getElementById('share-modal').classList.add('hidden');
        });

        // Share route button
        document.getElementById('share-route-btn').addEventListener('click', () => {
            this.shareRoute();
        });

        // Copy link button
        document.getElementById('copy-link-btn').addEventListener('click', () => {
            this.copyShareLink();
        });

        // Delete route button
        document.getElementById('delete-route-btn').addEventListener('click', () => {
            this.deleteRoute();
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.add('hidden');
            }
        });
    }

    shareRoute() {
        if (!this.currentRoute) return;

        const shareUrl = `${window.location.origin}/share/${this.currentRoute.shareableId}`;
        document.getElementById('share-link').value = shareUrl;
        
        // Hide route modal and show share modal
        document.getElementById('route-modal').classList.add('hidden');
        document.getElementById('share-modal').classList.remove('hidden');
    }

    async copyShareLink() {
        const shareLink = document.getElementById('share-link');
        
        try {
            await navigator.clipboard.writeText(shareLink.value);
            this.showToast('Link copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            shareLink.select();
            document.execCommand('copy');
            this.showToast('Link copied to clipboard!', 'success');
        }
    }

    async deleteRoute() {
        if (!this.currentRoute) return;

        if (!confirm('Are you sure you want to delete this route?')) {
            return;
        }

        try {
            const response = await fetch(`/api/routes/${this.currentRoute.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showToast('Route deleted successfully', 'success');
                document.getElementById('route-modal').classList.add('hidden');
                this.loadRoutes();
            } else {
                this.showToast('Failed to delete route', 'error');
            }
        } catch (error) {
            console.error('Error deleting route:', error);
            this.showToast('Error deleting route', 'error');
        }
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

    async initializeDemoData() {
        // Check if we have any routes already
        if (this.routes.length > 0) return;

        // Create demo routes
        const demoRoutes = [
            {
                name: "Central Park Loop",
                description: "A scenic loop around Central Park perfect for morning rides",
                waypoints: [
                    { lat: 40.7829, lng: -73.9654, name: "Start Point" },
                    { lat: 40.7589, lng: -73.9441, name: "Turn Point" },
                    { lat: 40.7829, lng: -73.9654, name: "End Point" }
                ],
                distance: 10.2,
                difficulty: "Easy"
            },
            {
                name: "Brooklyn Bridge Ride",
                description: "Cross the iconic Brooklyn Bridge with amazing city views",
                waypoints: [
                    { lat: 40.7061, lng: -73.9969, name: "Manhattan Side" },
                    { lat: 40.6892, lng: -73.9942, name: "Brooklyn Side" }
                ],
                distance: 3.5,
                difficulty: "Easy"
            }
        ];

        // Save demo routes
        for (const route of demoRoutes) {
            try {
                await fetch('/api/routes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(route)
                });
            } catch (error) {
                console.error('Error creating demo route:', error);
            }
        }

        // Reload routes to show demo data
        this.loadRoutes();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CyclingApp();
});