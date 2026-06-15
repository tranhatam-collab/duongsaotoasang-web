/**
 * DSTS Layer 6 — Global Vietnamese Map Marker Clustering
 * Vanilla JS clustering (no external map library required).
 * Works with any map container; clusters markers by proximity.
 */
(function () {
  if (window.DSTSMapCluster) return;

  window.DSTSMapCluster = {
    /**
     * Group markers into clusters by pixel distance
     * @param {Array<{lat:number, lon:number, x:number, y:number}>} markers — must have x,y in pixels
     * @param {number} gridSize — pixel distance threshold (default 60)
     * @returns {Array<{x:number, y:number, count:number, markers:Array}>}
     */
    cluster(markers, gridSize = 60) {
      if (!markers?.length) return [];
      const clusters = [];
      const visited = new Set();

      for (let i = 0; i < markers.length; i++) {
        if (visited.has(i)) continue;
        const cluster = { x: markers[i].x, y: markers[i].y, count: 1, markers: [markers[i]] };
        visited.add(i);

        for (let j = i + 1; j < markers.length; j++) {
          if (visited.has(j)) continue;
          const dx = markers[i].x - markers[j].x;
          const dy = markers[i].y - markers[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < gridSize) {
            cluster.markers.push(markers[j]);
            cluster.count++;
            cluster.x = (cluster.x * (cluster.count - 1) + markers[j].x) / cluster.count;
            cluster.y = (cluster.y * (cluster.count - 1) + markers[j].y) / cluster.count;
            visited.add(j);
          }
        }
        clusters.push(cluster);
      }
      return clusters;
    },

    /**
     * Render clusters into a container
     * @param {HTMLElement} container
     * @param {Array} clusters
     * @param {{onClick?:Function}} opts
     */
    render(container, clusters, opts = {}) {
      if (!container) return;
      container.innerHTML = '';
      const frag = document.createDocumentFragment();

      clusters.forEach(c => {
        const el = document.createElement('div');
        el.className = 'dsts-map-cluster';
        el.style.cssText = `position:absolute;left:${c.x}px;top:${c.y}px;transform:translate(-50%,-50%)`;
        el.innerHTML = `<span class="dsts-map-cluster__count">${c.count}</span>`;
        if (opts.onClick) {
          el.style.cursor = 'pointer';
          el.addEventListener('click', () => opts.onClick(c));
        }
        frag.appendChild(el);
      });

      container.appendChild(frag);
    },

    /**
     * Convert lat/lon to pixel x,y given map bounds and container size
     */
    project(lat, lon, bounds, width, height) {
      const x = (lon - bounds.west) / (bounds.east - bounds.west) * width;
      const y = (bounds.north - lat) / (bounds.north - bounds.south) * height;
      return { x, y };
    },

    /**
     * Full pipeline: lat/lon markers → clusters → render
     */
    showMarkers(container, markers, bounds, opts = {}) {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const projected = markers.map(m => {
        const p = this.project(m.lat, m.lon, bounds, width, height);
        return { ...m, x: p.x, y: p.y };
      });
      const clusters = this.cluster(projected, opts.gridSize || 60);
      this.render(container, clusters, opts);
      return clusters;
    }
  };
})();
