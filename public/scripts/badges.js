// Badge-specific JavaScript functionality

// Load and display badges
async function loadBadges() {
  try {
    // Load both available badges and earned badges
    const [availableBadges, earnedBadges, stats] = await Promise.all([
      apiGet('/badges'),
      apiGet('/badges/earned'),
      apiGet('/activities/stats')
    ]);
    
    if (!availableBadges || !earnedBadges || !stats) {
      showBadgeError();
      return;
    }
    
    displayBadgeStats(earnedBadges.length, availableBadges.length);
    displayEarnedBadges(earnedBadges);
    displayAvailableBadges(availableBadges, earnedBadges, stats);
    
  } catch (error) {
    console.error('Error loading badges:', error);
    showBadgeError();
  }
}

// Display badge statistics
function displayBadgeStats(earnedCount, totalCount) {
  document.getElementById('earned-count').textContent = earnedCount;
  document.getElementById('total-count').textContent = totalCount;
}

// Display earned badges
function displayEarnedBadges(earnedBadges) {
  const container = document.getElementById('earned-badges');
  
  if (earnedBadges.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🏆</div>
        <p>No badges earned yet. Start cycling to earn your first badge!</p>
      </div>
    `;
    return;
  }
  
  const badgesHTML = earnedBadges.map(userBadge => createBadgeCard(userBadge.badge, true, userBadge.earnedDate)).join('');
  container.innerHTML = badgesHTML;
}

// Display available badges with progress
function displayAvailableBadges(availableBadges, earnedBadges, stats) {
  const container = document.getElementById('available-badges');
  const earnedBadgeIds = earnedBadges.map(b => b.badgeId);
  
  // Filter out already earned badges
  const unearned = availableBadges.filter(badge => !earnedBadgeIds.includes(badge.id));
  
  if (unearned.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🌟</div>
        <p>Congratulations! You've earned all available badges!</p>
      </div>
    `;
    return;
  }
  
  const badgesHTML = unearned.map(badge => {
    const progress = calculateBadgeProgress(badge, stats);
    return createBadgeCard(badge, false, null, progress);
  }).join('');
  
  container.innerHTML = badgesHTML;
}

// Calculate progress toward a badge
function calculateBadgeProgress(badge, stats) {
  let current = 0;
  let target = badge.criteria.threshold;
  
  switch (badge.criteria.type) {
    case 'activity_count':
      current = stats.totalActivities;
      break;
    case 'total_distance':
      current = stats.totalDistance;
      break;
    case 'total_elevation':
      current = stats.totalElevation;
      break;
  }
  
  const percentage = Math.min((current / target) * 100, 100);
  
  return {
    current,
    target,
    percentage,
    unit: getBadgeUnit(badge.criteria.type)
  };
}

// Get unit for badge type
function getBadgeUnit(criteriaType) {
  switch (criteriaType) {
    case 'activity_count':
      return 'rides';
    case 'total_distance':
      return 'km';
    case 'total_elevation':
      return 'm';
    default:
      return '';
  }
}

// Create badge card HTML
function createBadgeCard(badge, isEarned, earnedDate = null, progress = null) {
  const earnedClass = isEarned ? 'earned' : 'locked';
  const earnedDateHTML = isEarned && earnedDate ? `<div class="badge-earned-date">Earned ${formatDate(earnedDate)}</div>` : '';
  
  let progressHTML = '';
  if (!isEarned && progress) {
    progressHTML = `
      <div class="badge-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress.percentage}%"></div>
        </div>
        <div class="progress-text">
          ${progress.current.toFixed(progress.unit === 'km' ? 1 : 0)} / ${progress.target} ${progress.unit}
          (${progress.percentage.toFixed(0)}%)
        </div>
      </div>
    `;
  }
  
  return `
    <div class="badge-card ${earnedClass}">
      ${earnedDateHTML}
      <span class="badge-icon">${badge.icon}</span>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-description">${badge.description}</div>
      <div class="badge-criteria">
        ${getBadgeCriteriaText(badge.criteria)}
      </div>
      ${progressHTML}
    </div>
  `;
}

// Get human-readable criteria text
function getBadgeCriteriaText(criteria) {
  switch (criteria.type) {
    case 'activity_count':
      return `Complete ${criteria.threshold} cycling ${criteria.threshold === 1 ? 'activity' : 'activities'}`;
    case 'total_distance':
      return `Cycle a total distance of ${criteria.threshold}km`;
    case 'total_elevation':
      return `Gain a total elevation of ${criteria.threshold}m`;
    default:
      return 'Complete the challenge';
  }
}

// Show error state for badges
function showBadgeError() {
  const earnedContainer = document.getElementById('earned-badges');
  const availableContainer = document.getElementById('available-badges');
  
  const errorHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">❌</div>
      <p>Failed to load badges. Please try again later.</p>
    </div>
  `;
  
  earnedContainer.innerHTML = errorHTML;
  availableContainer.innerHTML = errorHTML;
  
  document.getElementById('earned-count').textContent = '—';
  document.getElementById('total-count').textContent = '—';
}

// Get badge type icon
function getBadgeTypeIcon(type) {
  switch (type) {
    case 'milestone':
      return '🎯';
    case 'distance':
      return '📏';
    case 'elevation':
      return '⛰️';
    default:
      return '🏆';
  }
}