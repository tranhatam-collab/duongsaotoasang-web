// DSTS Impact Reports Component
// Impact report display for Sponsor Ecosystem

class ImpactReports {
  constructor(options = {}) {
    this.container = options.container;
    this.reports = options.reports || [];
  }

  render() {
    if (this.reports.length === 0) {
      return `
        <div class="impact-reports">
          <div class="impact-reports__header">
            <div class="impact-reports__title">Impact Reports</div>
            <div class="impact-reports__actions">
              <button class="impact-reports__btn impact-reports__btn--primary" data-action="generate">
                + Generate Report
              </button>
            </div>
          </div>
          <div class="impact-reports__empty">
            No impact reports found
          </div>
        </div>
      `;
    }

    const reportCards = this.reports.map(report => `
      <div class="impact-report-card" data-id="${report.id}">
        <div class="impact-report-card__header">
          <div class="impact-report-card__title">${report.title}</div>
          <div class="impact-report-card__date">${new Date(report.created_at).toLocaleDateString()}</div>
        </div>
        <div class="impact-report-card__sponsor">
          <div class="impact-report-card__sponsor-logo">
            ${report.sponsor_logo || '🏢'}
          </div>
          <div class="impact-report-card__sponsor-name">${report.sponsor_name}</div>
        </div>
        <div class="impact-report-card__metrics">
          <div class="impact-report-card__metric">
            <div class="impact-report-card__metric-label">Impressions</div>
            <div class="impact-report-card__metric-value">${this.formatNumber(report.impressions || 0)}</div>
          </div>
          <div class="impact-report-card__metric">
            <div class="impact-report-card__metric-label">Engagement</div>
            <div class="impact-report-card__metric-value">${this.formatNumber(report.engagement || 0)}</div>
          </div>
          <div class="impact-report-card__metric">
            <div class="impact-report-card__metric-label">Conversions</div>
            <div class="impact-report-card__metric-value">${this.formatNumber(report.conversions || 0)}</div>
          </div>
          <div class="impact-report-card__metric">
            <div class="impact-report-card__metric-label">ROI</div>
            <div class="impact-report-card__metric-value">${report.roi ? `${report.roi.toFixed(1)}%` : 'N/A'}</div>
          </div>
        </div>
        <div class="impact-report-card__summary">
          ${report.summary || 'No summary available'}
        </div>
        <div class="impact-report-card__actions">
          <button class="impact-report-card__action-btn impact-report-card__action-btn--primary" data-action="view" data-id="${report.id}">
            View Full Report
          </button>
          <button class="impact-report-card__action-btn" data-action="download" data-id="${report.id}">
            Download PDF
          </button>
          <button class="impact-report-card__action-btn" data-action="share" data-id="${report.id}">
            Share
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div class="impact-reports">
        <div class="impact-reports__header">
          <div class="impact-reports__title">Impact Reports</div>
          <div class="impact-reports__actions">
            <button class="impact-reports__btn impact-reports__btn--primary" data-action="generate">
              + Generate Report
            </button>
          </div>
        </div>
        <div class="impact-reports__list">
          ${reportCards}
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
    // Action buttons
    const actionButtons = this.container.querySelectorAll('.impact-reports__btn, .impact-report-card__action-btn');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const id = e.target.dataset.id;
        this.onAction(action, id);
      });
    });
  }

  onAction(action, id) {
    // Dispatch custom event for parent components to handle
    const event = new CustomEvent('impactReportAction', {
      detail: { action, id }
    });
    this.container.dispatchEvent(event);
  }

  formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }

  addReport(report) {
    this.reports.push(report);
    this.mount();
  }

  updateReport(id, updates) {
    const index = this.reports.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reports[index] = { ...this.reports[index], ...updates };
      this.mount();
    }
  }

  deleteReport(id) {
    this.reports = this.reports.filter(r => r.id !== id);
    this.mount();
  }

  static create(options) {
    const reports = new ImpactReports(options);
    return reports.render();
  }

  static mount(options) {
    const reports = new ImpactReports(options);
    return reports.mount();
  }
}

// Auto-initialize impact reports on page load
document.addEventListener('DOMContentLoaded', () => {
  const reportsElements = document.querySelectorAll('[data-impact-reports]');
  
  reportsElements.forEach(element => {
    const reportsData = element.dataset.reports;
    const reports = reportsData ? JSON.parse(reportsData) : [];
    
    const impactReports = new ImpactReports({
      container: element,
      reports
    });
    impactReports.mount();
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImpactReports;
}
