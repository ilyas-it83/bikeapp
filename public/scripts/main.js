// Main JavaScript file for common functionality
console.log('Cycling Companion App Initialized');

// Utility functions
const utils = {
  // Format distance with appropriate units
  formatDistance: (distance) => {
    return `${distance} km`;
  },

  // Format rating display
  formatRating: (rating, count) => {
    return `⭐ ${rating.toFixed(1)} (${count} reviews)`;
  },

  // Format difficulty with proper styling
  formatDifficulty: (difficulty) => {
    return {
      text: difficulty,
      className: `difficulty ${difficulty.toLowerCase()}`
    };
  },

  // Create difficulty badge element
  createDifficultyBadge: (difficulty) => {
    const badge = document.createElement('span');
    const formatted = utils.formatDifficulty(difficulty);
    badge.textContent = formatted.text;
    badge.className = formatted.className;
    return badge;
  },

  // Create rating badge element
  createRatingBadge: (rating, count) => {
    const badge = document.createElement('span');
    badge.textContent = utils.formatRating(rating, count);
    badge.className = 'rating';
    return badge;
  },

  // Create tag elements
  createTags: (tags) => {
    return tags.map(tag => {
      const tagElement = document.createElement('span');
      tagElement.textContent = tag;
      tagElement.className = 'tag';
      return tagElement;
    });
  },

  // Show/hide loading state
  showLoading: (element) => {
    element.style.display = 'block';
  },

  hideLoading: (element) => {
    element.style.display = 'none';
  },

  // Show/hide elements
  showElement: (element) => {
    element.style.display = 'block';
  },

  hideElement: (element) => {
    element.style.display = 'none';
  },

  // API request helper
  apiRequest: async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};

// Make utils available globally
window.utils = utils;