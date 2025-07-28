// Activities management functionality
class ActivitiesManager {
    constructor() {
        this.activities = [];
        this.bindEvents();
        this.loadActivities();
    }

    bindEvents() {
        // Save activity form
        const saveForm = document.getElementById('save-activity-form');
        if (saveForm) {
            saveForm.addEventListener('submit', (e) => this.handleSaveActivity(e));
        }

        // Cancel save button
        const cancelBtn = document.getElementById('cancel-save');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideSaveForm());
        }
    }

    async handleSaveActivity(event) {
        event.preventDefault();
        
        if (!window.gpsTracker) {
            this.showStatus('GPS tracker not available', 'error');
            return;
        }

        const form = event.target;
        const formData = new FormData(form);
        const name = formData.get('activity-name') || document.getElementById('activity-name').value;
        const notes = formData.get('activity-notes') || document.getElementById('activity-notes').value;

        // Get tracking data
        const trackingData = window.gpsTracker.getTrackingData();
        
        if (!trackingData.route || trackingData.route.length < 2) {
            this.showStatus('Not enough route data to save', 'error');
            return;
        }

        // Prepare activity data according to the data model
        const activityData = {
            name: name.trim(),
            date: trackingData.startTime ? new Date(trackingData.startTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            distance: trackingData.distance,
            duration: trackingData.duration,
            averageSpeed: trackingData.averageSpeed || 0,
            maxSpeed: trackingData.maxSpeed || 0,
            elevationGain: 0, // Would need elevation API for real data
            route: trackingData.route.map(point => ({
                lat: point.lat,
                lng: point.lng,
                elevation: point.elevation || 0
            })),
            notes: notes.trim()
        };

        try {
            await this.saveActivity(activityData);
            this.showStatus('Activity saved successfully!', 'success');
            this.hideSaveForm();
            this.loadActivities(); // Refresh activities list
        } catch (error) {
            console.error('Error saving activity:', error);
            this.showStatus('Failed to save activity', 'error');
        }
    }

    async saveActivity(activityData) {
        const response = await fetch('/api/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activityData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save activity');
        }

        return await response.json();
    }

    async loadActivities() {
        try {
            const response = await fetch('/api/activities');
            if (!response.ok) {
                throw new Error('Failed to fetch activities');
            }
            
            this.activities = await response.json();
            this.renderActivities();
        } catch (error) {
            console.error('Error loading activities:', error);
            this.showStatus('Failed to load activities', 'error');
        }
    }

    renderActivities() {
        const activitiesList = document.getElementById('activities-list');
        if (!activitiesList) return;

        if (this.activities.length === 0) {
            activitiesList.innerHTML = `
                <div class="no-activities">
                    <p>No activities yet. Start tracking your first ride!</p>
                </div>
            `;
            return;
        }

        // Sort activities by date (newest first)
        const sortedActivities = [...this.activities].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        activitiesList.innerHTML = sortedActivities.map(activity => 
            this.renderActivityItem(activity)
        ).join('');
    }

    renderActivityItem(activity) {
        const date = new Date(activity.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const duration = this.formatDuration(activity.duration);
        const distance = activity.distance.toFixed(2);
        const avgSpeed = activity.averageSpeed.toFixed(1);
        const maxSpeed = activity.maxSpeed.toFixed(1);

        return `
            <div class="activity-item" data-activity-id="${activity.id}">
                <div class="activity-header">
                    <div class="activity-name">${this.escapeHtml(activity.name)}</div>
                    <div class="activity-date">${formattedDate}</div>
                </div>
                <div class="activity-stats">
                    <div class="activity-stat">
                        <strong>${distance} km</strong> distance
                    </div>
                    <div class="activity-stat">
                        <strong>${duration}</strong> duration
                    </div>
                    <div class="activity-stat">
                        <strong>${avgSpeed} km/h</strong> avg speed
                    </div>
                    <div class="activity-stat">
                        <strong>${maxSpeed} km/h</strong> max speed
                    </div>
                    ${activity.elevationGain > 0 ? `
                        <div class="activity-stat">
                            <strong>${activity.elevationGain.toFixed(0)} m</strong> elevation
                        </div>
                    ` : ''}
                </div>
                ${activity.notes ? `
                    <div class="activity-notes">
                        <em>${this.escapeHtml(activity.notes)}</em>
                    </div>
                ` : ''}
            </div>
        `;
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    hideSaveForm() {
        const form = document.getElementById('activity-form');
        if (form) {
            form.style.display = 'none';
        }
        
        // Clear form
        const nameInput = document.getElementById('activity-name');
        const notesInput = document.getElementById('activity-notes');
        if (nameInput) nameInput.value = '';
        if (notesInput) notesInput.value = '';
    }

    showStatus(message, type = 'info') {
        const statusEl = document.getElementById('status-message');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status-message ${type}`;
            statusEl.style.display = 'block';
            
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 3000);
        }
    }

    // Method to get activities data for external use
    getActivities() {
        return this.activities;
    }

    // Method to refresh activities (useful after external changes)
    refresh() {
        this.loadActivities();
    }
}

// Initialize activities manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.activitiesManager = new ActivitiesManager();
});