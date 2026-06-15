// DSTS Charts Component
// Simple SVG charts for Creator Economy Dashboard

class Chart {
  constructor(options = {}) {
    this.container = options.container;
    this.type = options.type || 'line'; // 'line' or 'bar'
    this.data = options.data || [];
    this.labels = options.labels || [];
    this.colors = options.colors || ['#3b82f6', '#10b981', '#f59e0b'];
    this.title = options.title || '';
    this.period = options.period || '30d';
  }

  renderLineChart() {
    if (this.data.length === 0) {
      return '<div class="chart-card__empty">No data available</div>';
    }

    const width = 100;
    const height = 100;
    const padding = 10;
    
    const maxValue = Math.max(...this.data);
    const minValue = Math.min(...this.data);
    const range = maxValue - minValue || 1;
    
    const points = this.data.map((value, index) => {
      const x = padding + (index / (this.data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = [
      `${padding},${height - padding}`,
      points,
      `${width - padding},${height - padding}`
    ].join(' ');

    return `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${this.colors[0]};stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:${this.colors[0]};stop-opacity:0" />
          </linearGradient>
        </defs>
        <polygon points="${areaPoints}" fill="url(#chartGradient)" />
        <polyline points="${points}" fill="none" stroke="${this.colors[0]}" stroke-width="2" />
        ${this.data.map((value, index) => {
          const x = padding + (index / (this.data.length - 1)) * (width - 2 * padding);
          const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
          return `<circle cx="${x}" cy="${y}" r="2" fill="${this.colors[0]}" />`;
        }).join('')}
      </svg>
    `;
  }

  renderBarChart() {
    if (this.data.length === 0) {
      return '<div class="chart-card__empty">No data available</div>';
    }

    const width = 100;
    const height = 100;
    const padding = 10;
    const barWidth = (width - 2 * padding) / this.data.length - 2;
    
    const maxValue = Math.max(...this.data);
    
    const bars = this.data.map((value, index) => {
      const x = padding + index * ((width - 2 * padding) / this.data.length) + 1;
      const barHeight = (value / maxValue) * (height - 2 * padding);
      const y = height - padding - barHeight;
      return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${this.colors[index % this.colors.length]}" />`;
    }).join('');

    return `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        ${bars}
      </svg>
    `;
  }

  render() {
    const chartContent = this.type === 'line' 
      ? this.renderLineChart() 
      : this.renderBarChart();

    const periodButtons = ['7d', '30d', '90d'].map(period => `
      <button 
        class="chart-card__period-btn ${this.period === period ? 'chart-card__period-btn--active' : ''}"
        data-period="${period}"
      >
        ${period}
      </button>
    `).join('');

    return `
      <div class="chart-card">
        <div class="chart-card__header">
          <div class="chart-card__title">${this.title}</div>
          <div class="chart-card__period-selector">
            ${periodButtons}
          </div>
        </div>
        <div class="chart-card__chart">
          ${chartContent}
          <div class="chart-card__tooltip"></div>
        </div>
        <div class="chart-card__legend">
          <div class="chart-card__legend-item">
            <div class="chart-card__legend-color" style="background: ${this.colors[0]}"></div>
            <span>${this.title}</span>
          </div>
        </div>
      </div>
    `;
  }

  mount() {
    if (this.container) {
      this.container.innerHTML = this.render();
      this.attachEventListeners();
    }
    return this;
  }

  attachEventListeners() {
    const periodButtons = this.container.querySelectorAll('.chart-card__period-btn');
    periodButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.period = e.target.dataset.period;
        this.mount();
      });
    });
  }

  updateData(newData) {
    this.data = newData;
    this.mount();
  }

  static create(options) {
    const chart = new Chart(options);
    return chart.render();
  }

  static mount(options) {
    const chart = new Chart(options);
    return chart.mount();
  }
}

// Revenue Chart (30d)
class RevenueChart extends Chart {
  constructor(options = {}) {
    super({
      ...options,
      type: 'line',
      title: options.title || 'Revenue (30d)',
      colors: ['#10b981', '#3b82f6', '#f59e0b']
    });
  }
}

// Retention Chart (90d)
class RetentionChart extends Chart {
  constructor(options = {}) {
    super({
      ...options,
      type: 'line',
      title: options.title || 'Retention Rate (90d)',
      colors: ['#8b5cf6', '#ec4899', '#10b981']
    });
  }
}

// Auto-initialize charts on page load
document.addEventListener('DOMContentLoaded', () => {
  const chartElements = document.querySelectorAll('[data-chart]');
  
  chartElements.forEach(element => {
    const chartType = element.dataset.chartType || 'line';
    const chartData = element.dataset.chartData;
    const data = chartData ? JSON.parse(chartData) : [];
    const labels = element.dataset.labels ? JSON.parse(element.dataset.labels) : [];
    const title = element.dataset.title || '';
    const period = element.dataset.period || '30d';
    
    let chart;
    if (chartType === 'revenue') {
      chart = new RevenueChart({
        container: element,
        data,
        labels,
        title,
        period
      });
    } else if (chartType === 'retention') {
      chart = new RetentionChart({
        container: element,
        data,
        labels,
        title,
        period
      });
    } else {
      chart = new Chart({
        container: element,
        type: chartType,
        data,
        labels,
        title,
        period
      });
    }
    chart.mount();
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Chart, RevenueChart, RetentionChart };
}
