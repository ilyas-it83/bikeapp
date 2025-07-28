// Main application JavaScript

// API base URL
const API_BASE = '/api';

// Global state
let currentSection = 'badges';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  loadBadges();
  loadActivities();
  loadStats();
  
  // Set up event listeners
  document.getElementById('check-badges-btn')?.addEventListener('click', checkForNewBadges);
  
  // Close modal when clicking outside
  document.getElementById('badge-modal').addEventListener('click', (e) => {
    if (e.target.id === 'badge-modal') {
      closeBadgeModal();
    }
  });
  
  document.querySelector('.close')?.addEventListener('click', closeBadgeModal);
});

// Navigation handling
function initializeNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      link.classList.add('active');
      
      // Show corresponding section
      const targetSection = link.getAttribute('href').substring(1);
      showSection(targetSection);
    });
  });
}

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('main section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show target section
  const targetSection = document.getElementById(`${sectionName}-section`);
  if (targetSection) {
    targetSection.style.display = 'block';
    currentSection = sectionName;
  }
}

// API helper functions
async function apiGet(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`API GET error for ${endpoint}:`, error);
    return null;
  }
}

async function apiPost(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`API POST error for ${endpoint}:`, error);
    return null;
  }
}

// Load activities and display them
async function loadActivities() {
  const activities = await apiGet('/activities');
  
  if (!activities) {
    document.getElementById('activities-list').innerHTML = 
      '<div class="empty-state"><div class="empty-state-icon">😔</div><p>Failed to load activities</p></div>';
    return;
  }
  
  if (activities.length === 0) {
    document.getElementById('activities-list').innerHTML = 
      '<div class="empty-state"><div class="empty-state-icon">🚴</div><p>No activities yet. Start your first ride!</p></div>';
    return;
  }
  
  const activitiesHTML = activities.map(activity => `
    <div class="activity-card">
      <div class="activity-icon">🚴</div>
      <div class="activity-details">
        <h4>${activity.name}</h4>
        <div class="activity-stats">
          <span>📏 ${activity.distance}km</span>
          <span>⏱️ ${Math.round(activity.duration / 60)}min</span>
          <span>⛰️ ${activity.elevationGain}m</span>
          <span>🚀 ${activity.averageSpeed}km/h</span>
        </div>
      </div>
      <div class="activity-date">${activity.date}</div>
    </div>
  `).join('');
  
  document.getElementById('activities-list').innerHTML = activitiesHTML;
}

// Load and display statistics
async function loadStats() {
  const stats = await apiGet('/activities/stats');
  
  if (!stats) {
    document.getElementById('stats-grid').innerHTML = 
      '<div class="empty-state"><div class="empty-state-icon">📊</div><p>Failed to load statistics</p></div>';
    return;
  }
  
  const statsHTML = `
    <div class="stats-card">
      <span class="stats-value">${stats.totalActivities}</span>
      <span class="stats-label">Total Rides</span>
    </div>
    <div class="stats-card">
      <span class="stats-value">${stats.totalDistance.toFixed(1)}km</span>
      <span class="stats-label">Total Distance</span>
    </div>
    <div class="stats-card">
      <span class="stats-value">${stats.totalElevation}m</span>
      <span class="stats-label">Total Elevation</span>
    </div>
    <div class="stats-card">
      <span class="stats-value">${Math.round(stats.totalDuration / 60)}min</span>
      <span class="stats-label">Total Time</span>
    </div>
    <div class="stats-card">
      <span class="stats-value">${stats.averageSpeed.toFixed(1)}km/h</span>
      <span class="stats-label">Average Speed</span>
    </div>
  `;
  
  document.getElementById('stats-grid').innerHTML = statsHTML;
}

// Check for new badges
async function checkForNewBadges() {
  const button = document.getElementById('check-badges-btn');
  const originalText = button.textContent;
  
  button.textContent = 'Checking...';
  button.disabled = true;
  
  const result = await apiPost('/badges/check');
  
  if (result && result.newBadges && result.newBadges.length > 0) {
    // Show modal for new badges
    showNewBadgesModal(result.newBadges);
    // Reload badges display
    loadBadges();
  } else {
    // Show a temporary message
    button.textContent = 'No new badges';
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 2000);
    return;
  }
  
  button.textContent = originalText;
  button.disabled = false;
}

// Show modal for new badges
function showNewBadgesModal(newBadges) {
  const modal = document.getElementById('badge-modal');
  const content = document.getElementById('modal-badge-content');
  
  const badgesHTML = newBadges.map(userBadge => `
    <div class="badge-card earned" style="margin: 1rem 0;">
      <span class="badge-icon">${userBadge.badge.icon}</span>
      <div class="badge-name">${userBadge.badge.name}</div>
      <div class="badge-description">${userBadge.badge.description}</div>
    </div>
  `).join('');
  
  content.innerHTML = badgesHTML;
  modal.style.display = 'block';
}

// Close badge modal
function closeBadgeModal() {
  document.getElementById('badge-modal').style.display = 'none';
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}