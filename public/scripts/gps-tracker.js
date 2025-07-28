// GPS Tracker functionality
class GPSTracker {
    constructor() {
        this.isTracking = false;
        this.watchId = null;
        this.startTime = null;
        this.trackingData = {
            route: [],
            startTime: null,
            endTime: null,
            distance: 0,
            duration: 0,
            speeds: [],
            maxSpeed: 0
        };
        this.lastPosition = null;
        this.trackingInterval = null;
        
        // DOM elements
        this.startBtn = document.getElementById('start-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.distanceDisplay = document.getElementById('distance-display');
        this.timeDisplay = document.getElementById('time-display');
        this.speedDisplay = document.getElementById('speed-display');
        this.avgSpeedDisplay = document.getElementById('avg-speed-display');
        
        this.initializeMap();
        this.bindEvents();
    }

    initializeMap() {
        // Check if Leaflet is available
        if (typeof L === 'undefined' || window.leafletFailed) {
            console.warn('Leaflet not available - using fallback map display');
            this.initializeFallbackMap();
            return;
        }

        // Initialize Leaflet map
        this.map = L.map('map').setView([51.505, -0.09], 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        // Create polyline for tracking route
        this.routeLine = L.polyline([], {
            color: '#667eea',
            weight: 4,
            opacity: 0.8
        }).addTo(this.map);
        
        // Try to get user's current location for initial map center
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    this.map.setView([lat, lng], 15);
                },
                (error) => {
                    console.warn('Could not get initial location:', error);
                }
            );
        }
    }

    initializeFallbackMap() {
        // Create a simple fallback map display
        const mapEl = document.getElementById('map');
        mapEl.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                background: linear-gradient(45deg, #f0f2f5, #e9ecef);
                border: 2px dashed #dee2e6;
                border-radius: 8px;
                flex-direction: column;
                text-align: center;
                padding: 2rem;
                color: #6c757d;
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
                <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">GPS Route Tracking</div>
                <div style="font-size: 0.9rem;">Route will be tracked and saved<br>Map visualization unavailable in this environment</div>
                <div id="route-points" style="margin-top: 1rem; font-size: 0.8rem; color: #495057;"></div>
            </div>
        `;
        
        this.mapEl = mapEl;
        this.isLeafletAvailable = false;
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startTracking());
        this.stopBtn.addEventListener('click', () => this.stopTracking());
    }

    startTracking() {
        if (!navigator.geolocation) {
            this.showStatus('GPS not supported by this browser', 'error');
            return;
        }

        this.resetTrackingData();
        this.isTracking = true;
        this.startTime = Date.now();
        this.trackingData.startTime = new Date().toISOString();
        
        // Update UI
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.startBtn.textContent = 'Tracking...';
        
        // Start GPS tracking
        this.watchId = navigator.geolocation.watchPosition(
            (position) => this.handlePositionUpdate(position),
            (error) => this.handleLocationError(error),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
        
        // Start timer for metrics update
        this.trackingInterval = setInterval(() => {
            this.updateMetrics();
        }, 1000); // Update every second
        
        this.showStatus('GPS tracking started', 'success');
    }

    stopTracking() {
        if (!this.isTracking) return;
        
        this.isTracking = false;
        this.trackingData.endTime = new Date().toISOString();
        this.trackingData.duration = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Stop GPS tracking
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        
        // Stop timer
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
            this.trackingInterval = null;
        }
        
        // Update UI
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.startBtn.textContent = 'Start Tracking';
        
        // Final metrics update
        this.updateMetrics();
        
        this.showStatus('GPS tracking stopped', 'info');
        
        // Show save form if we have tracked data
        if (this.trackingData.route.length > 1) {
            this.showSaveForm();
        } else {
            this.showStatus('No route data to save', 'error');
        }
    }

    handlePositionUpdate(position) {
        if (!this.isTracking) return;
        
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        const speed = position.coords.speed; // m/s or null
        const timestamp = position.timestamp;
        
        // Only use positions with reasonable accuracy (< 50 meters)
        if (accuracy > 50) {
            console.warn('Poor GPS accuracy:', accuracy);
            return;
        }
        
        const newPoint = {
            lat: lat,
            lng: lng,
            elevation: 0, // Would need elevation API for real elevation
            timestamp: timestamp,
            accuracy: accuracy,
            speed: speed
        };
        
        // Add to route if it's the first point or if moved enough distance
        if (this.trackingData.route.length === 0 || 
            this.calculateDistance(this.lastPosition, newPoint) > 0.005) { // ~5 meters
            
            this.trackingData.route.push(newPoint);
            
            // Update route display
            this.updateRouteDisplay();
            
            // Calculate distance if we have previous point
            if (this.lastPosition) {
                const distanceIncrement = this.calculateDistance(this.lastPosition, newPoint);
                this.trackingData.distance += distanceIncrement;
            }
            
            // Calculate speed if available
            if (speed !== null && speed >= 0) {
                const speedKmh = speed * 3.6; // Convert m/s to km/h
                this.trackingData.speeds.push(speedKmh);
                this.trackingData.maxSpeed = Math.max(this.trackingData.maxSpeed, speedKmh);
            }
            
            this.lastPosition = newPoint;
        }
    }

    handleLocationError(error) {
        let message = 'Location error: ';
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message += 'Location access denied by user';
                break;
            case error.POSITION_UNAVAILABLE:
                message += 'Location information unavailable';
                break;
            case error.TIMEOUT:
                message += 'Location request timed out';
                break;
            default:
                message += 'Unknown location error';
                break;
        }
        console.error(message);
        this.showStatus(message, 'error');
    }

    calculateDistance(pos1, pos2) {
        // Haversine formula to calculate distance between two GPS points
        const R = 6371; // Earth's radius in kilometers
        const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
        const dLon = (pos2.lng - pos1.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in kilometers
    }

    updateMetrics() {
        if (!this.isTracking && this.trackingData.duration === 0) return;
        
        // Update time display
        const currentDuration = this.isTracking ? 
            Math.floor((Date.now() - this.startTime) / 1000) : 
            this.trackingData.duration;
        
        const hours = Math.floor(currentDuration / 3600);
        const minutes = Math.floor((currentDuration % 3600) / 60);
        const seconds = currentDuration % 60;
        
        this.timeDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update distance display
        this.distanceDisplay.textContent = `${this.trackingData.distance.toFixed(2)} km`;
        
        // Update speed displays
        const currentSpeed = this.trackingData.speeds.length > 0 ? 
            this.trackingData.speeds[this.trackingData.speeds.length - 1] : 0;
        this.speedDisplay.textContent = `${currentSpeed.toFixed(1)} km/h`;
        
        // Calculate average speed
        const avgSpeed = currentDuration > 0 ? 
            (this.trackingData.distance / (currentDuration / 3600)) : 0;
        this.avgSpeedDisplay.textContent = `${avgSpeed.toFixed(1)} km/h`;
    }

    updateRouteDisplay() {
        if (typeof L !== 'undefined' && this.routeLine && !window.leafletFailed) {
            // Update Leaflet map
            const latLngs = this.trackingData.route.map(point => [point.lat, point.lng]);
            this.routeLine.setLatLngs(latLngs);
            
            // Center map on current position if we have a route
            if (this.trackingData.route.length > 0) {
                const lastPoint = this.trackingData.route[this.trackingData.route.length - 1];
                this.map.setView([lastPoint.lat, lastPoint.lng], this.map.getZoom());
            }
        } else {
            // Update fallback display
            const routePointsEl = document.getElementById('route-points');
            if (routePointsEl) {
                const routeLength = this.trackingData.route.length;
                routePointsEl.textContent = `GPS Points Recorded: ${routeLength}`;
            }
        }
    }

    resetTrackingData() {
        this.trackingData = {
            route: [],
            startTime: null,
            endTime: null,
            distance: 0,
            duration: 0,
            speeds: [],
            maxSpeed: 0
        };
        this.lastPosition = null;
        
        // Reset map display
        if (typeof L !== 'undefined' && this.routeLine && !window.leafletFailed) {
            this.routeLine.setLatLngs([]);
        } else {
            // Reset fallback display
            const routePointsEl = document.getElementById('route-points');
            if (routePointsEl) {
                routePointsEl.textContent = '';
            }
        }
        
        // Reset display
        this.distanceDisplay.textContent = '0.00 km';
        this.timeDisplay.textContent = '00:00:00';
        this.speedDisplay.textContent = '0.0 km/h';
        this.avgSpeedDisplay.textContent = '0.0 km/h';
    }

    showSaveForm() {
        const form = document.getElementById('activity-form');
        const nameInput = document.getElementById('activity-name');
        
        // Generate default name
        const now = new Date();
        const defaultName = `Ride ${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        nameInput.value = defaultName;
        
        form.style.display = 'block';
        nameInput.focus();
    }

    getTrackingData() {
        return {
            ...this.trackingData,
            averageSpeed: this.trackingData.duration > 0 ? 
                (this.trackingData.distance / (this.trackingData.duration / 3600)) : 0
        };
    }

    showStatus(message, type = 'info') {
        const statusEl = document.getElementById('status-message');
        statusEl.textContent = message;
        statusEl.className = `status-message ${type}`;
        statusEl.style.display = 'block';
        
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 3000);
    }
}

// Initialize GPS tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gpsTracker = new GPSTracker();
});