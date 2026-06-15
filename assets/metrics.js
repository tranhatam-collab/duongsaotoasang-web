// DSTS Creator Metrics Display
// 8 metrics display for Creator Economy Dashboard

class MetricsDisplay {
  constructor(options = {}) {
    this.container = options.container;
    this.metrics = options.metrics || {};
    this.currency = options.currency || 'USD';
    this.compact = options.compact || false;
  }

  getMetricIcon(metricName) {
    const icons = {
      total_revenue: '💰',
      monthly_revenue: '📈',
      followers: '👥',
      engagement_rate: '❤️',
      retention_rate: '🔄',
      avg_watch_time: '⏱️',
      content_count: '📝',
      referral_count: '🔗'
    };
    return icons[metricName] || '📊';
  }

  getMetricLabel(metricName) {
    const labels = {
      total_revenue: 'Total Revenue',
      monthly_revenue: 'Monthly Revenue',
      followers: 'Followers',
      engagement_rate: 'Engagement Rate',
      retention_rate: 'Retention Rate',
      avg_watch_time: 'Avg Watch Time',
      content_count: 'Content Count',
      referral_count: 'Referrals'
    };
    return labels[metricName] || metricName;
  }

  formatMetricValue(metricName, value) {
    if (value === null || value === undefined) return 'N/A';
    
    switch (metricName) {
      case 'total_revenue':
      case 'monthly_revenue':
        return this.formatCurrency(value);
      case 'engagement_rate':
      case 'retention_rate':
        return `${value.toFixed(1)}%`;
      case 'avg_watch_time':
        return this.formatDuration(value);
      default:
        return this.formatNumber(value);
    }
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }

  formatDuration(seconds) {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  }

  getChangeClass(change) {
    if (change > 0) return 'metric-card__change--positive';
    if (change < 0) return 'metric-card__change--negative';
    return 'metric-card__change--neutral';
  }

  getChangeIcon(change) {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  }

  renderSparkline(data) {
    if (!data || data.length < 2) return '';
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    return `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
  }

  render() {
    const metricNames = [
      'total_revenue',
      'monthly_revenue',
      'followers',
      'engagement_rate',
      'retention_rate',
      'avg_watch_time',
      'content_count',
      'referral_count'
    ];

    const metricCards = metricNames.map(metricName => {
      const metric = this.metrics[metricName] || {};
      const value = metric.value || 0;
      const change = metric.change || 0;
      const sparklineData = metric.sparkline || [];
      const period = metric.period || '30d';
      
      return `
        <div class="metric-card">
          <div class="metric-card__header">
            <div class="metric-card__label">
              ${this.getMetricLabel(metricName)}
            </div>
            <div class="metric-card__icon">
              ${this.getMetricIcon(metricName)}
            </div>
          </div>
          <div class="metric-card__value ${metricName.includes('revenue') ? 'metric-card__value--currency' : ''}">
            ${this.formatMetricValue(metricName, value)}
          </div>
          <div class="metric-card__change ${this.getChangeClass(change)}">
            <span>${this.getChangeIcon(change)}</span>
            <span>${Math.abs(change).toFixed(1)}%</span>
          </div>
          <div class="metric-card__period">
            vs ${period} ago
          </div>
          ${sparklineData.length > 0 ? `
            <div class="metric-card__sparkline">
              ${this.renderSparkline(sparklineData)}
            </div>
          ` : ''}
          <div class="metric-card__footer">
            <div class="metric-card__footer-label">
              Target
            </div>
            <div class="metric-card__footer-value">
              ${this.formatMetricValue(metricName, metric.target || 0)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="metrics-grid ${this.compact ? 'metrics-grid--compact' : ''}">
        ${metricCards}
      </div>
    `;
  }

  mount() {
    if (this.container) {
      this.container.innerHTML = this.render();
    }
    return this;
  }

  updateMetrics(newMetrics) {
    this.metrics = { ...this.metrics, ...newMetrics };
    this.mount();
  }

  setCompact(compact) {
    this.compact = compact;
    this.mount();
  }

  static create(options) {
    const display = new MetricsDisplay(options);
    return display.render();
  }

  static mount(options) {
    const display = new MetricsDisplay(options);
    return display.mount();
  }
}

// Auto-initialize metrics displays on page load
document.addEventListener('DOMContentLoaded', () => {
  const metricsElements = document.querySelectorAll('[data-metrics-display]');
  
  metricsElements.forEach(element => {
    const metricsData = element.dataset.metrics;
    const metrics = metricsData ? JSON.parse(metricsData) : {};
    const currency = element.dataset.currency || 'USD';
    const compact = element.dataset.compact === 'true';
    
    const display = new MetricsDisplay({
      container: element,
      metrics,
      currency,
      compact
    });
    display.mount();
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MetricsDisplay;
}
