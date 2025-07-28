// Routes page functionality
document.addEventListener('DOMContentLoaded', () => {
  const loadingElement = document.getElementById('loading');
  const routesGrid = document.getElementById('routes-grid');
  const routesCount = document.getElementById('routes-count');
  const noRoutesElement = document.getElementById('no-routes');
  
  // Filter elements
  const difficultySelect = document.getElementById('difficulty');
  const minDistanceInput = document.getElementById('min-distance');
  const maxDistanceInput = document.getElementById('max-distance');
  const minRatingSelect = document.getElementById('min-rating');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const clearFiltersBtn = document.getElementById('clear-filters');

  let allRoutes = [];

  // Load all routes initially
  const loadRoutes = async (filters = {}) => {
    try {
      utils.showLoading(loadingElement);
      utils.hideElement(routesGrid);
      utils.hideElement(noRoutesElement);

      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const url = `/api/routes${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const data = await utils.apiRequest(url);

      if (data.success) {
        allRoutes = data.routes;
        displayRoutes(data.routes);
        updateRoutesCount(data.count);
      } else {
        throw new Error('Failed to load routes');
      }
    } catch (error) {
      console.error('Error loading routes:', error);
      showError('Failed to load routes. Please try again.');
    } finally {
      utils.hideLoading(loadingElement);
    }
  };

  // Display routes in grid
  const displayRoutes = (routes) => {
    routesGrid.innerHTML = '';

    if (routes.length === 0) {
      utils.showElement(noRoutesElement);
      utils.hideElement(routesGrid);
      return;
    }

    utils.hideElement(noRoutesElement);
    utils.showElement(routesGrid);

    routes.forEach(route => {
      const routeCard = createRouteCard(route);
      routesGrid.appendChild(routeCard);
    });
  };

  // Create individual route card
  const createRouteCard = (route) => {
    const card = document.createElement('div');
    card.className = 'route-card';

    const difficultyBadge = utils.createDifficultyBadge(route.difficulty);
    const ratingBadge = utils.createRatingBadge(route.rating, route.ratingCount);

    card.innerHTML = `
      <div class="route-card-content">
        <div class="route-title">
          <h4>${route.name}</h4>
          <div class="route-meta">
            ${ratingBadge.outerHTML}
            ${difficultyBadge.outerHTML}
          </div>
        </div>
        <p class="route-description">${route.description}</p>
        <div class="route-stats">
          <div class="stat">
            <div class="stat-label">Distance</div>
            <div class="stat-value">${utils.formatDistance(route.distance)}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Elevation</div>
            <div class="stat-value">${route.totalElevationGain}m</div>
          </div>
        </div>
        <div class="route-tags">
          <div class="tags-container">
            ${route.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
        <div class="route-actions">
          <span class="creator">by ${route.creator}</span>
          <a href="/route/${route.id}" class="view-details">View Details →</a>
        </div>
      </div>
    `;

    return card;
  };

  // Update routes count display
  const updateRoutesCount = (count) => {
    routesCount.textContent = `Found ${count} route${count !== 1 ? 's' : ''}`;
  };

  // Show error message
  const showError = (message) => {
    routesGrid.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
      </div>
    `;
    utils.showElement(routesGrid);
  };

  // Get current filter values
  const getCurrentFilters = () => {
    const filters = {};

    if (difficultySelect.value) {
      filters.difficulty = difficultySelect.value;
    }

    if (minDistanceInput.value) {
      filters.minDistance = minDistanceInput.value;
    }

    if (maxDistanceInput.value) {
      filters.maxDistance = maxDistanceInput.value;
    }

    if (minRatingSelect.value) {
      filters.minRating = minRatingSelect.value;
    }

    return filters;
  };

  // Clear all filters
  const clearFilters = () => {
    difficultySelect.value = '';
    minDistanceInput.value = '';
    maxDistanceInput.value = '';
    minRatingSelect.value = '';
  };

  // Event listeners
  applyFiltersBtn.addEventListener('click', () => {
    const filters = getCurrentFilters();
    loadRoutes(filters);
  });

  clearFiltersBtn.addEventListener('click', () => {
    clearFilters();
    loadRoutes();
  });

  // Allow Enter key to apply filters in input fields
  [minDistanceInput, maxDistanceInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const filters = getCurrentFilters();
        loadRoutes(filters);
      }
    });
  });

  // Initial load
  loadRoutes();
});