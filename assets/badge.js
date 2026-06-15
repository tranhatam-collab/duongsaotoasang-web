// DSTS Verified Badge Component
// Displays trust score badge across all contexts

class DSTSBadge {
  constructor(options = {}) {
    this.container = options.container;
    this.trustScore = options.trustScore || 0;
    this.size = options.size || 'normal';
    this.showScore = options.showScore !== false;
  }

  getBadgeLevel() {
    if (this.trustScore >= 90) return 'verified';
    if (this.trustScore >= 80) return 'gold';
    if (this.trustScore >= 70) return 'silver';
    if (this.trustScore >= 60) return 'bronze';
    return 'unverified';
  }

  getBadgeLabel() {
    const level = this.getBadgeLevel();
    const labels = {
      verified: 'VERIFIED',
      gold: 'GOLD',
      silver: 'SILVER',
      bronze: 'BRONZE',
      unverified: 'UNVERIFIED'
    };
    return labels[level];
  }

  getBadgeIcon() {
    const level = this.getBadgeLevel();
    const icons = {
      verified: '✓',
      gold: '★',
      silver: '★',
      bronze: '★',
      unverified: '?'
    };
    return icons[level];
  }

  render() {
    const level = this.getBadgeLevel();
    const label = this.getBadgeLabel();
    const icon = this.getBadgeIcon();
    
    // Hide badge if trust score < 60
    if (this.trustScore < 60) {
      return '';
    }

    const sizeClass = this.size === 'small' ? 'dsts-badge--small' : 
                      this.size === 'large' ? 'dsts-badge--large' : '';

    return `
      <span class="dsts-badge dsts-badge--${level} ${sizeClass}" data-trust-score="${this.trustScore}">
        <span class="dsts-badge__icon">${icon}</span>
        <span class="dsts-badge__label">${label}</span>
        ${this.showScore ? `<span class="dsts-badge__score">${this.trustScore}</span>` : ''}
      </span>
    `;
  }

  mount() {
    if (this.container) {
      this.container.innerHTML = this.render();
    }
    return this;
  }

  static create(options) {
    const badge = new DSTSBadge(options);
    return badge.render();
  }

  static mount(options) {
    const badge = new DSTSBadge(options);
    return badge.mount();
  }
}

// Auto-initialize badges on page load
document.addEventListener('DOMContentLoaded', () => {
  // Find all elements with data-dsts-badge attribute
  const badgeElements = document.querySelectorAll('[data-dsts-badge]');
  
  badgeElements.forEach(element => {
    const trustScore = parseInt(element.dataset.trustScore || '0');
    const size = element.dataset.badgeSize || 'normal';
    const showScore = element.dataset.showScore !== 'false';
    
    const badge = new DSTSBadge({
      container: element,
      trustScore,
      size,
      showScore
    });
    badge.mount();
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DSTSBadge;
}
