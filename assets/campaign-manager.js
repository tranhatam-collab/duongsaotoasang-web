// DSTS Campaign Manager Component
// Campaign management for Sponsor Ecosystem

class CampaignManager {
  constructor(options = {}) {
    this.container = options.container;
    this.campaigns = options.campaigns || [];
    this.filter = options.filter || 'all';
  }

  getStatusLabel(status) {
    const labels = {
      active: 'Active',
      pending: 'Pending',
      completed: 'Completed',
      paused: 'Paused'
    };
    return labels[status] || status;
  }

  filterCampaigns() {
    if (this.filter === 'all') {
      return this.campaigns;
    }
    return this.campaigns.filter(campaign => campaign.status === this.filter);
  }

  render() {
    const filteredCampaigns = this.filterCampaigns();
    
    if (filteredCampaigns.length === 0) {
      return `
        <div class="campaign-manager">
          <div class="campaign-manager__header">
            <div class="campaign-manager__title">Campaign Manager</div>
            <div class="campaign-manager__actions">
              <button class="campaign-manager__btn campaign-manager__btn--primary" data-action="create">
                + New Campaign
              </button>
            </div>
          </div>
          <div class="campaign-manager__filters">
            <button class="campaign-manager__filter campaign-manager__filter--active" data-filter="all">All</button>
            <button class="campaign-manager__filter" data-filter="active">Active</button>
            <button class="campaign-manager__filter" data-filter="pending">Pending</button>
            <button class="campaign-manager__filter" data-filter="completed">Completed</button>
          </div>
          <div class="campaign-manager__empty">
            No campaigns found
          </div>
        </div>
      `;
    }

    const campaignCards = filteredCampaigns.map(campaign => `
      <div class="campaign-card" data-id="${campaign.id}">
        <div class="campaign-card__info">
          <div class="campaign-card__name">${campaign.name}</div>
          <div class="campaign-card__status campaign-card__status--${campaign.status}">
            ${this.getStatusLabel(campaign.status)}
          </div>
        </div>
        <div class="campaign-card__metrics">
          <div class="campaign-card__metric">
            Impressions
            <div class="campaign-card__metric-value">${this.formatNumber(campaign.impressions || 0)}</div>
          </div>
          <div class="campaign-card__metric">
            Clicks
            <div class="campaign-card__metric-value">${this.formatNumber(campaign.clicks || 0)}</div>
          </div>
        </div>
        <div class="campaign-card__budget">
          <div class="campaign-card__budget-label">Budget</div>
          <div class="campaign-card__budget-value">${this.formatCurrency(campaign.budget || 0)}</div>
          <div class="campaign-card__budget-label">Spent</div>
          <div class="campaign-card__budget-value">${this.formatCurrency(campaign.spent || 0)}</div>
        </div>
        <div class="campaign-card__actions">
          <button class="campaign-card__action-btn" data-action="view" data-id="${campaign.id}">
            View
          </button>
          <button class="campaign-card__action-btn" data-action="edit" data-id="${campaign.id}">
            Edit
          </button>
          <button class="campaign-card__action-btn" data-action="pause" data-id="${campaign.id}">
            ${campaign.status === 'active' ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>
    `).join('');

    const filterButtons = ['all', 'active', 'pending', 'completed'].map(filter => `
      <button 
        class="campaign-manager__filter ${this.filter === filter ? 'campaign-manager__filter--active' : ''}"
        data-filter="${filter}"
      >
        ${filter.charAt(0).toUpperCase() + filter.slice(1)}
      </button>
    `).join('');

    return `
      <div class="campaign-manager">
        <div class="campaign-manager__header">
          <div class="campaign-manager__title">Campaign Manager</div>
          <div class="campaign-manager__actions">
            <button class="campaign-manager__btn campaign-manager__btn--primary" data-action="create">
              + New Campaign
            </button>
          </div>
        </div>
        <div class="campaign-manager__filters">
          ${filterButtons}
        </div>
        <div class="campaign-manager__list">
          ${campaignCards}
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
    // Filter buttons
    const filterButtons = this.container.querySelectorAll('.campaign-manager__filter');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.filter = e.target.dataset.filter;
        this.mount();
      });
    });

    // Action buttons
    const actionButtons = this.container.querySelectorAll('.campaign-manager__btn, .campaign-card__action-btn');
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
    const event = new CustomEvent('campaignAction', {
      detail: { action, id }
    });
    this.container.dispatchEvent(event);
  }

  formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  setFilter(filter) {
    this.filter = filter;
    this.mount();
  }

  addCampaign(campaign) {
    this.campaigns.push(campaign);
    this.mount();
  }

  updateCampaign(id, updates) {
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index !== -1) {
      this.campaigns[index] = { ...this.campaigns[index], ...updates };
      this.mount();
    }
  }

  deleteCampaign(id) {
    this.campaigns = this.campaigns.filter(c => c.id !== id);
    this.mount();
  }

  static create(options) {
    const manager = new CampaignManager(options);
    return manager.render();
  }

  static mount(options) {
    const manager = new CampaignManager(options);
    return manager.mount();
  }
}

// Auto-initialize campaign managers on page load
document.addEventListener('DOMContentLoaded', () => {
  const managerElements = document.querySelectorAll('[data-campaign-manager]');
  
  managerElements.forEach(element => {
    const campaignsData = element.dataset.campaigns;
    const campaigns = campaignsData ? JSON.parse(campaignsData) : [];
    const filter = element.dataset.filter || 'all';
    
    const manager = new CampaignManager({
      container: element,
      campaigns,
      filter
    });
    manager.mount();
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CampaignManager;
}
