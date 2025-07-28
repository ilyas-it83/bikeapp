// Main app functionality and navigation
class CyclingApp {
    constructor() {
        this.currentSection = 'tracker';
        this.bindEvents();
        this.initializeApp();
    }

    bindEvents() {
        // Navigation buttons
        document.getElementById('nav-tracker')?.addEventListener('click', () => {
            this.switchSection('tracker');
        });

        document.getElementById('nav-activities')?.addEventListener('click', () => {
            this.switchSection('activities');
        });

        // Check for geolocation support on app load
        this.checkGeolocationSupport();
    }

    initializeApp() {
        // Set initial section
        this.switchSection('tracker');
        
        // Show welcome message
        this.showWelcomeMessage();
    }

    switchSection(sectionName) {
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active-section');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        const targetNavBtn = document.getElementById(`nav-${sectionName}`);

        if (targetSection && targetNavBtn) {
            targetSection.classList.add('active-section');
            targetNavBtn.classList.add('active');
            this.currentSection = sectionName;

            // Trigger section-specific actions
            this.handleSectionChange(sectionName);
        }
    }

    handleSectionChange(sectionName) {
        switch (sectionName) {
            case 'tracker':
                // Resize map when tracker section is shown
                setTimeout(() => {
                    if (window.gpsTracker && window.gpsTracker.map && typeof L !== 'undefined' && !window.leafletFailed) {
                        window.gpsTracker.map.invalidateSize();
                    }
                }, 100);
                break;
                
            case 'activities':
                // Refresh activities when activities section is shown
                if (window.activitiesManager) {
                    window.activitiesManager.refresh();
                }
                break;
        }
    }

    checkGeolocationSupport() {
        if (!navigator.geolocation) {
            this.showStatus('GPS/Geolocation is not supported by this browser. GPS tracking will not work.', 'error');
            
            // Disable tracking buttons
            const startBtn = document.getElementById('start-btn');
            const stopBtn = document.getElementById('stop-btn');
            if (startBtn) {
                startBtn.disabled = true;
                startBtn.textContent = 'GPS Not Supported';
            }
            if (stopBtn) {
                stopBtn.disabled = true;
            }
        } else {
            // Test if user has already granted permission
            navigator.permissions?.query({name: 'geolocation'}).then((result) => {
                if (result.state === 'denied') {
                    this.showStatus('Location access denied. Please enable location services for GPS tracking.', 'error');
                }
            }).catch(() => {
                // Permissions API not supported, ignore
            });
        }
    }

    showWelcomeMessage() {
        const hasSeenWelcome = localStorage.getItem('cycling-app-welcome-seen');
        
        if (!hasSeenWelcome) {
            setTimeout(() => {
                this.showStatus('Welcome to Cycling Companion! Click Start Tracking to begin recording your ride.', 'info');
                localStorage.setItem('cycling-app-welcome-seen', 'true');
            }, 1000);
        }
    }

    showStatus(message, type = 'info') {
        const statusEl = document.getElementById('status-message');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status-message ${type}`;
            statusEl.style.display = 'block';
            
            // Auto-hide after 5 seconds for welcome message, 3 seconds for others
            const hideDelay = type === 'info' && message.includes('Welcome') ? 5000 : 3000;
            
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, hideDelay);
        }
    }

    // Utility method to get current app state
    getAppState() {
        return {
            currentSection: this.currentSection,
            isTracking: window.gpsTracker?.isTracking || false,
            hasActivities: window.activitiesManager?.activities?.length > 0 || false
        };
    }

    // Method to handle app-wide keyboard shortcuts
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + 1: Switch to tracker
        if ((event.ctrlKey || event.metaKey) && event.key === '1') {
            event.preventDefault();
            this.switchSection('tracker');
        }
        
        // Ctrl/Cmd + 2: Switch to activities
        if ((event.ctrlKey || event.metaKey) && event.key === '2') {
            event.preventDefault();
            this.switchSection('activities');
        }
        
        // Space: Start/Stop tracking (only in tracker section)
        if (event.code === 'Space' && this.currentSection === 'tracker') {
            event.preventDefault();
            if (window.gpsTracker) {
                if (window.gpsTracker.isTracking) {
                    window.gpsTracker.stopTracking();
                } else {
                    window.gpsTracker.startTracking();
                }
            }
        }
    }

    // Method to show loading state
    showLoading(show = true) {
        const loadingEl = document.getElementById('loading-indicator');
        if (loadingEl) {
            loadingEl.style.display = show ? 'block' : 'none';
        }
    }

    // Method to handle network connectivity
    handleNetworkStatus() {
        const showNetworkStatus = (online) => {
            const message = online ? 
                'Internet connection restored' : 
                'Internet connection lost. GPS tracking will continue offline.';
            const type = online ? 'success' : 'info';
            this.showStatus(message, type);
        };

        window.addEventListener('online', () => showNetworkStatus(true));
        window.addEventListener('offline', () => showNetworkStatus(false));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cyclingApp = new CyclingApp();
    
    // Add keyboard shortcut listener
    document.addEventListener('keydown', (event) => {
        window.cyclingApp.handleKeyboardShortcuts(event);
    });
    
    // Handle network status changes
    window.cyclingApp.handleNetworkStatus();
});

// Handle page visibility changes (for battery optimization)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - could implement power saving measures
        console.log('App hidden - consider power saving measures');
    } else {
        // Page is visible - resume normal operations
        console.log('App visible - resume normal operations');
        
        // Refresh map if needed
        if (window.gpsTracker && window.gpsTracker.map && typeof L !== 'undefined' && !window.leafletFailed) {
            setTimeout(() => {
                window.gpsTracker.map.invalidateSize();
            }, 100);
        }
    }
});