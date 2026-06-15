// DSTS Marker Clustering
// Simple marker clustering for Global Vietnamese Map

class MarkerCluster {
  constructor(options = {}) {
    this.markers = options.markers || [];
    this.zoom = options.zoom || 10;
    this.clusterRadius = options.clusterRadius || 50;
  }

  // Simple grid-based clustering
  clusterMarkers() {
    if (this.zoom >= 12) {
      // At high zoom, show all markers
      return this.markers.map(marker => ({
        ...marker,
        isCluster: false
      }));
    }

    const clusters = [];
    const processed = new Set();

    for (const marker of this.markers) {
      if (processed.has(marker.id)) continue;

      const cluster = {
        id: `cluster-${marker.id}`,
        lat: marker.lat,
        lng: marker.lng,
        markers: [marker],
        count: 1,
        isCluster: true
      };

      // Find nearby markers
      for (const other of this.markers) {
        if (other.id === marker.id || processed.has(other.id)) continue;

        const distance = this.calculateDistance(marker, other);
        if (distance < this.clusterRadius) {
          cluster.markers.push(other);
          cluster.count++;
          processed.add(other.id);
          
          // Update cluster center to average
          cluster.lat = (cluster.lat * (cluster.count - 1) + other.lat) / cluster.count;
          cluster.lng = (cluster.lng * (cluster.count - 1) + other.lng) / cluster.count;
        }
      }

      processed.add(marker.id);
      clusters.push(cluster);
    }

    return clusters;
  }

  calculateDistance(marker1, marker2) {
    const R = 6371; // Earth's radius in km
    const dLat = (marker2.lat - marker1.lat) * Math.PI / 180;
    const dLng = (marker2.lng - marker1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(marker1.lat * Math.PI / 180) * Math.cos(marker2.lat * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  getClusterSize(count) {
    if (count < 10) return 'small';
    if (count < 50) return 'medium';
    if (count < 100) return 'large';
    return 'xlarge';
  }

  getClusterColor(count) {
    if (count < 10) return '#3b82f6';
    if (count < 50) return '#10b981';
    if (count < 100) return '#f59e0b';
    return '#ef4444';
  }

  getClusterRadius(count) {
    const base = 20;
    const increment = 5;
    return base + Math.min(count, 50) * increment;
  }

  render() {
    const clustered = this.clusterMarkers();
    
    return clustered.map(cluster => {
      if (cluster.isCluster) {
        const size = this.getClusterSize(cluster.count);
        const color = this.getClusterColor(cluster.count);
        const radius = this.getClusterRadius(cluster.count);
        
        return {
          id: cluster.id,
          lat: cluster.lat,
          lng: cluster.lng,
          isCluster: true,
          count: cluster.count,
          markers: cluster.markers,
          size,
          color,
          radius
        };
      } else {
        return {
          ...cluster,
          isCluster: false
        };
      }
    });
  }

  setZoom(zoom) {
    this.zoom = zoom;
  }

  setMarkers(markers) {
    this.markers = markers;
  }

  static create(options) {
    const cluster = new MarkerCluster(options);
    return cluster.render();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarkerCluster;
}
