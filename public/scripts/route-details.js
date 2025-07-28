// Route details page functionality
document.addEventListener('DOMContentLoaded', () => {
  const loadingElement = document.getElementById('loading');
  const routeContent = document.getElementById('route-content');
  const routeNotFound = document.getElementById('route-not-found');
  const shareRouteBtn = document.getElementById('share-route');

  let currentRoute = null;

  // Get route ID from URL
  const getRouteId = () => {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[pathSegments.length - 1];
  };

  // Load route details
  const loadRouteDetails = async (routeId) => {
    try {
      utils.showLoading(loadingElement);
      utils.hideElement(routeContent);
      utils.hideElement(routeNotFound);

      const data = await utils.apiRequest(`/api/routes/${routeId}`);

      if (data.success) {
        currentRoute = data.route;
        displayRouteDetails(data.route);
        utils.showElement(routeContent);
      } else {
        throw new Error('Route not found');
      }
    } catch (error) {
      console.error('Error loading route details:', error);
      utils.showElement(routeNotFound);
    } finally {
      utils.hideLoading(loadingElement);
    }
  };

  // Display route details
  const displayRouteDetails = (route) => {
    // Update page title
    document.title = `${route.name} - Cycling Companion`;

    // Route header information
    document.getElementById('route-name').textContent = route.name;
    document.getElementById('route-description').textContent = route.description;

    // Route meta information in header
    const headerRating = document.getElementById('route-rating');
    const headerDifficulty = document.getElementById('route-difficulty');
    const headerDistance = document.getElementById('route-distance');

    headerRating.textContent = utils.formatRating(route.rating, route.ratingCount);
    headerRating.className = 'rating';

    const difficultyFormatted = utils.formatDifficulty(route.difficulty);
    headerDifficulty.textContent = difficultyFormatted.text;
    headerDifficulty.className = difficultyFormatted.className;

    headerDistance.textContent = utils.formatDistance(route.distance);
    headerDistance.className = 'distance';

    // Route statistics
    document.getElementById('stat-distance').textContent = utils.formatDistance(route.distance);
    document.getElementById('stat-difficulty').textContent = route.difficulty;
    document.getElementById('stat-rating').textContent = `${route.rating}/5.0 (${route.ratingCount} reviews)`;
    document.getElementById('stat-elevation').textContent = `${route.totalElevationGain}m`;
    document.getElementById('stat-surface').textContent = route.surface;
    document.getElementById('stat-traffic').textContent = route.traffic;

    // Route tags
    const tagsContainer = document.getElementById('route-tags');
    tagsContainer.innerHTML = '';
    route.tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.textContent = tag;
      tagElement.className = 'tag';
      tagsContainer.appendChild(tagElement);
    });

    // Initialize map
    initializeMap(route);

    // Create elevation chart
    createElevationChart(route.elevationProfile);
  };

  // Initialize simple map placeholder
  const initializeMap = (route) => {
    const mapContainer = document.getElementById('map');
    
    // Create a simple map placeholder showing route information
    mapContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f8fafc; color: #64748b; text-align: center; padding: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
        <h4 style="margin-bottom: 1rem; color: #1e293b;">Route Map</h4>
        <div style="background: #e2e8f0; padding: 1rem; border-radius: 0.5rem; max-width: 300px;">
          <p><strong>Starting Point:</strong> ${route.waypoints[0].name}</p>
          <p><strong>Ending Point:</strong> ${route.waypoints[route.waypoints.length - 1].name}</p>
          <p><strong>Total Waypoints:</strong> ${route.waypoints.length}</p>
          <p style="font-size: 0.875rem; margin-top: 1rem; font-style: italic;">Interactive map would be displayed here with full Leaflet.js integration in production</p>
        </div>
      </div>
    `;
  };

  // Create simple elevation chart
  const createElevationChart = (elevationProfile) => {
    const chartContainer = document.getElementById('elevation-chart');
    chartContainer.innerHTML = '';

    if (!elevationProfile || elevationProfile.length === 0) {
      chartContainer.innerHTML = '<p>No elevation data available</p>';
      return;
    }

    // Create simple SVG chart
    const chartWidth = chartContainer.offsetWidth - 40;
    const chartHeight = 160;
    const margin = { top: 10, right: 20, bottom: 30, left: 40 };
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    // Get min/max values
    const minElevation = Math.min(...elevationProfile.map(p => p.elevation));
    const maxElevation = Math.max(...elevationProfile.map(p => p.elevation));
    const maxDistance = Math.max(...elevationProfile.map(p => p.distance));

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', chartWidth);
    svg.setAttribute('height', chartHeight);
    svg.style.background = '#f8fafc';
    svg.style.border = '1px solid #e2e8f0';
    svg.style.borderRadius = '0.5rem';

    // Create chart area
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chartGroup.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);

    // Create path for elevation profile
    let pathData = '';
    elevationProfile.forEach((point, index) => {
      const x = (point.distance / maxDistance) * width;
      const y = height - ((point.elevation - minElevation) / (maxElevation - minElevation)) * height;
      
      if (index === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    });

    // Add path to chart
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#2563eb');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    chartGroup.appendChild(path);

    // Add axes
    // X-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', height);
    xAxis.setAttribute('x2', width);
    xAxis.setAttribute('y2', height);
    xAxis.setAttribute('stroke', '#64748b');
    chartGroup.appendChild(xAxis);

    // Y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', height);
    yAxis.setAttribute('stroke', '#64748b');
    chartGroup.appendChild(yAxis);

    // Add labels
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', width / 2);
    xLabel.setAttribute('y', height + 25);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('font-size', '12');
    xLabel.setAttribute('fill', '#64748b');
    xLabel.textContent = 'Distance (km)';
    chartGroup.appendChild(xLabel);

    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', -height / 2);
    yLabel.setAttribute('y', -25);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('font-size', '12');
    yLabel.setAttribute('fill', '#64748b');
    yLabel.setAttribute('transform', `rotate(-90, -25, ${height / 2})`);
    yLabel.textContent = 'Elevation (m)';
    chartGroup.appendChild(yLabel);

    svg.appendChild(chartGroup);
    chartContainer.appendChild(svg);
  };

  // Share route functionality
  const shareRoute = () => {
    if (!currentRoute) return;

    const url = window.location.href;
    
    if (navigator.share) {
      // Use native sharing if available
      navigator.share({
        title: currentRoute.name,
        text: currentRoute.description,
        url: url
      }).catch(console.error);
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Route link copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Route link copied to clipboard!');
      });
    }
  };

  // Event listeners
  if (shareRouteBtn) {
    shareRouteBtn.addEventListener('click', shareRoute);
  }

  // Load route details on page load
  const routeId = getRouteId();
  if (routeId) {
    loadRouteDetails(routeId);
  } else {
    utils.showElement(routeNotFound);
    utils.hideLoading(loadingElement);
  }
});