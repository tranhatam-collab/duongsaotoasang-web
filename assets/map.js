// DSTS Map Component
// Leaflet-based map for Global Vietnamese Map

class DSTSMap {
  constructor(options = {}) {
    this.container = options.container;
    this.center = options.center || [21.0285, 105.8542]; // Vietnam center
    this.zoom = options.zoom || 5;
    this.markers = options.markers || [];
    this.tileUrl = options.tileUrl || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.filters = options.filters || {};
    this.cluster = options.cluster !== false;
  }

  init() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
      this.loadLeaflet();
    } else {
      this.render();
    }
  }

  loadLeaflet() {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => this.render();
    document.head.appendChild(script);
  }

  render() {
    this.container.innerHTML = `
      <div class="map-container">
        <div class="map-container__map" id="map-${this.container.id}"></div>
        <div class="map-container__loading">Loading map...</div>
        <div class="map-container__error" style="display: none;">Failed to load map</div>
        <div class="map-container__controls">
          <button class="map-container__control-btn" data-action="zoom-in" title="Zoom in">+</button>
          <button class="map-container__control-btn" data-action="zoom-out" title="Zoom out">−</button>
          <button class="map-container__control-btn" data-action="locate" title="Locate me">📍</button>
        </div>
        <div class="map-container__filter">
          <div class="map-container__filter-title">Filters</div>
          <div class="map-container__filter-group">
            <div class="map-container__filter-label">Entity Type</div>
            <select class="map-container__filter-select" data-filter="entity_type">
              <option value="all">All</option>
              <option value="creator">Creator</option>
              <option value="mentor">Mentor</option>
              <option value="sponsor">Sponsor</option>
            </select>
          </div>
          <div class="map-container__filter-group">
            <div class="map-container__filter-label">Country</div>
            <select class="map-container__filter-select" data-filter="country">
              <option value="all">All Countries</option>
              <option value="VN">Vietnam</option>
              <option value="US">United States</option>
              <option value="AU">Australia</option>
              <option value="CA">Canada</option>
            </select>
          </div>
          <div class="map-container__filter-group">
            <div class="map-container__filter-label">Trust Score</div>
            <select class="map-container__filter-select" data-filter="trust_score">
              <option value="all">All</option>
              <option value="90+">90+ (Verified)</option>
              <option value="80+">80+ (Gold)</option>
              <option value="70+">70+ (Silver)</option>
              <option value="60+">60+ (Bronze)</option>
            </select>
          </div>
        </div>
        <div class="map-container__legend">
          <div class="map-container__legend-title">Legend</div>
          <div class="map-container__legend-item">
            <div class="map-container__legend-color" style="background: #10b981"></div>
            <span>Verified (90+)</span>
          </div>
          <div class="map-container__legend-item">
            <div class="map-container__legend-color" style="background: #f59e0b"></div>
            <span>Gold (80+)</span>
          </div>
          <div class="map-container__legend-item">
            <div class="map-container__legend-color" style="background: #6b7280"></div>
            <span>Silver (70+)</span>
          </div>
          <div class="map-container__legend-item">
            <div class="map-container__legend-color" style="background: #cd7f32"></div>
            <span>Bronze (60+)</span>
          </div>
        </div>
      </div>
    `;

    // Initialize Leaflet map
    const mapId = `map-${this.container.id}`;
    setTimeout(() => {
      try {
        this.map = L.map(mapId).setView(this.center, this.zoom);
        
        // Add tile layer
        L.tileLayer(this.tileUrl, {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        // Add markers
        this.addMarkers();
        
        // Hide loading
        this.container.querySelector('.map-container__loading').style.display = 'none';
        
        // Attach event listeners
        this.attachEventListeners();
      } catch (error) {
        console.error('Map initialization error:', error);
        this.container.querySelector('.map-container__loading').style.display = 'none';
        this.container.querySelector('.map-container__error').style.display = 'block';
      }
    }, 100);
  }

  addMarkers() {
    if (!this.map) return;

    // Clear existing markers
    this.markerLayer = L.layerGroup().addTo(this.map);

    // Filter markers
    const filteredMarkers = this.filterMarkers();

    // Add markers to map
    filteredMarkers.forEach(marker => {
      const markerOptions = {
        icon: this.createMarkerIcon(marker),
        title: marker.display_name || marker.name
      };

      const leafletMarker = L.marker([marker.lat, marker.lng], markerOptions);
      
      // Add popup
      const popupContent = this.createPopupContent(marker);
      leafletMarker.bindPopup(popupContent);
      
      leafletMarker.addTo(this.markerLayer);
    });
  }

  createMarkerIcon(marker) {
    const color = this.getMarkerColor(marker.trust_score);
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }

  getMarkerColor(trustScore) {
    if (trustScore >= 90) return '#10b981';
    if (trustScore >= 80) return '#f59e0b';
    if (trustScore >= 70) return '#6b7280';
    if (trustScore >= 60) return '#cd7f32';
    return '#9ca3af';
  }

  createPopupContent(marker) {
    return `
      <div style="min-width: 200px;">
        <div style="font-weight: 600; margin-bottom: 4px;">${marker.display_name || marker.name}</div>
        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${marker.entity_type || 'Entity'}</div>
        <div style="font-size: 12px; margin-bottom: 4px;">
          Trust Score: <strong>${marker.trust_score || 0}</strong>
        </div>
        <div style="font-size: 12px; margin-bottom: 8px;">
          <a href="/verify/${marker.id}" style="color: #3b82f6;">View Profile</a>
        </div>
      </div>
    `;
  }

  filterMarkers() {
    return this.markers.filter(marker => {
      if (this.filters.entity_type && this.filters.entity_type !== 'all' && marker.entity_type !== this.filters.entity_type) {
        return false;
      }
      if (this.filters.country && this.filters.country !== 'all' && marker.country !== this.filters.country) {
        return false;
      }
      if (this.filters.trust_score && this.filters.trust_score !== 'all') {
        const minScore = parseInt(this.filters.trust_score);
        if (marker.trust_score < minScore) return false;
      }
      return true;
    });
  }

  attachEventListeners() {
    // Control buttons
    const controlButtons = this.container.querySelectorAll('.map-container__control-btn');
    controlButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        this.onControlAction(action);
      });
    });

    // Filter selects
    const filterSelects = this.container.querySelectorAll('.map-container__filter-select');
    filterSelects.forEach(select => {
      select.addEventListener('change', (e) => {
        const filter = e.target.dataset.filter;
        const value = e.target.value;
        this.filters[filter] = value;
        this.addMarkers();
      });
    });
  }

  onControlAction(action) {
    if (!this.map) return;

    switch (action) {
      case 'zoom-in':
        this.map.zoomIn();
        break;
      case 'zoom-out':
        this.map.zoomOut();
        break;
      case 'locate':
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.map.setView([position.coords.latitude, position.coords.longitude], 13);
            },
            (error) => {
              console.error('Geolocation error:', error);
            }
          );
        }
        break;
    }
  }

  setCenter(center) {
    this.center = center;
    if (this.map) {
      this.map.setView(center, this.zoom);
    }
  }

  setZoom(zoom) {
    this.zoom = zoom;
    if (this.map) {
      this.map.setZoom(zoom);
    }
  }

  setMarkers(markers) {
    this.markers = markers;
    this.addMarkers();
  }

  static create(options) {
    const map = new DSTSMap(options);
    map.init();
    return map;
  }
}

// Auto-initialize maps on page load
document.addEventListener('DOMContentLoaded', () => {
  const mapElements = document.querySelectorAll('[data-dsts-map]');
  
  mapElements.forEach(element => {
    const markersData = element.dataset.markers;
    const markers = markersData ? JSON.parse(markersData) : [];
    const center = element.dataset.center ? JSON.parse(element.dataset.center) : undefined;
    const zoom = parseInt(element.dataset.zoom) || 5;
    
    const map = new DSTSMap({
      container: element,
      markers,
      center,
      zoom
    });
    map.init();
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DSTSMap;
}
