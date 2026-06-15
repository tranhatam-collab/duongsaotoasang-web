// DSTS Evidence Pack UI Component
// Public/private evidence display

class EvidencePack {
  constructor(options = {}) {
    this.container = options.container;
    this.entityId = options.entityId;
    this.showPrivate = options.showPrivate || false;
    this.evidence = options.evidence || [];
  }

  getEvidenceIcon(type) {
    const icons = {
      id_document: '📄',
      passport: '🛂',
      national_id: '🪪',
      driver_license: '🚗',
      address_proof: '🏠',
      bank_statement: '💳',
      employment_proof: '💼',
      education_proof: '🎓',
      media_article: '📰',
      award: '🏆',
      certificate: '📜',
      other: '📎'
    };
    return icons[type] || '📎';
  }

  getEvidenceLabel(type) {
    const labels = {
      id_document: 'ID Document',
      passport: 'Passport',
      national_id: 'National ID',
      driver_license: 'Driver License',
      address_proof: 'Address Proof',
      bank_statement: 'Bank Statement',
      employment_proof: 'Employment Proof',
      education_proof: 'Education Proof',
      media_article: 'Media Article',
      award: 'Award',
      certificate: 'Certificate',
      other: 'Other'
    };
    return labels[type] || 'Other';
  }

  getStatusLabel(status) {
    const labels = {
      verified: 'VERIFIED',
      pending: 'PENDING',
      rejected: 'REJECTED'
    };
    return labels[status] || 'UNKNOWN';
  }

  filterEvidence() {
    if (this.showPrivate) {
      return this.evidence;
    }
    return this.evidence.filter(e => !e.is_private);
  }

  render() {
    const filteredEvidence = this.filterEvidence();
    
    if (filteredEvidence.length === 0) {
      return `
        <div class="evidence-pack">
          <div class="evidence-pack__empty">
            No evidence available
          </div>
        </div>
      `;
    }

    const evidenceItems = filteredEvidence.map(evidence => `
      <div class="evidence-item">
        <div class="evidence-item__icon">
          ${this.getEvidenceIcon(evidence.type)}
        </div>
        <div class="evidence-item__content">
          <div class="evidence-item__type">
            ${this.getEvidenceLabel(evidence.type)}
            ${evidence.is_private ? '<span class="evidence-item__private-badge">🔒 PRIVATE</span>' : ''}
          </div>
          <div class="evidence-item__description">
            ${evidence.description || 'No description'}
          </div>
          <div class="evidence-item__meta">
            Added ${new Date(evidence.created_at).toLocaleDateString()}
          </div>
        </div>
        <div class="evidence-item__status evidence-item__status--${evidence.status}">
          ${this.getStatusLabel(evidence.status)}
        </div>
      </div>
    `).join('');

    return `
      <div class="evidence-pack">
        <div class="evidence-pack__header">
          <div class="evidence-pack__title">
            Evidence Pack (${filteredEvidence.length} items)
          </div>
          <div class="evidence-pack__toggle">
            <button 
              class="evidence-pack__toggle-btn ${!this.showPrivate ? 'evidence-pack__toggle-btn--active' : ''}"
              data-show-private="false"
            >
              Public
            </button>
            <button 
              class="evidence-pack__toggle-btn ${this.showPrivate ? 'evidence-pack__toggle-btn--active' : ''}"
              data-show-private="true"
            >
              Private
            </button>
          </div>
        </div>
        <div class="evidence-pack__list">
          ${evidenceItems}
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
    const toggleButtons = this.container.querySelectorAll('.evidence-pack__toggle-btn');
    toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const showPrivate = e.target.dataset.showPrivate === 'true';
        this.showPrivate = showPrivate;
        this.mount();
      });
    });
  }

  static create(options) {
    const pack = new EvidencePack(options);
    return pack.render();
  }

  static mount(options) {
    const pack = new EvidencePack(options);
    return pack.mount();
  }
}

// Auto-initialize evidence packs on page load
document.addEventListener('DOMContentLoaded', () => {
  const evidenceElements = document.querySelectorAll('[data-evidence-pack]');
  
  evidenceElements.forEach(element => {
    const entityId = element.dataset.entityId;
    const showPrivate = element.dataset.showPrivate === 'true';
    
    // Fetch evidence from API
    fetch(`/api/verify/evidence/${entityId}`)
      .then(res => res.json())
      .then(data => {
        const pack = new EvidencePack({
          container: element,
          entityId,
          showPrivate,
          evidence: data.evidence || []
        });
        pack.mount();
      })
      .catch(error => {
        console.error('Failed to load evidence pack:', error);
        element.innerHTML = '<div class="evidence-pack__empty">Failed to load evidence</div>';
      });
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EvidencePack;
}
