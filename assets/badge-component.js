/**
 * DSTS Layer 1 — Verified Identity Badge Component
 * Renders trust badge, score ring, and evidence pack preview.
 */
(function () {
  if (window.DSTSBadge) return;

  const BADGE_LABELS = {
    vi: { none: 'Chưa xác thực', bronze: 'Đồng', silver: 'Bạc', gold: 'Vàng', platinum: 'Bạch kim', diamond: 'Kim cương' },
    en: { none: 'Unverified', bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum', diamond: 'Diamond' }
  };

  const EVIDENCE_ICONS = {
    identity_document: '🪪',
    portfolio: '🎨',
    achievement: '🏆',
    reference: '💬',
    interview: '🎙️',
    media: '📰',
    social: '🔗',
    certificate: '📜',
    default: '📎'
  };

  const STATUS_LABELS = {
    vi: { verified: 'Đã xác minh', pending: 'Chờ duyệt', rejected: 'Từ chối' },
    en: { verified: 'Verified', pending: 'Pending', rejected: 'Rejected' }
  };

  window.DSTSBadge = {
    /**
     * Render a badge element
     * @param {HTMLElement} container
     * @param {{badgeType:string, trustScore:number, lang?:string}} data
     */
    renderBadge(container, data) {
      if (!container) return;
      const lang = data.lang || (window.DSTS?.getLang?.() || 'vi');
      const label = BADGE_LABELS[lang]?.[data.badgeType] || data.badgeType;

      const el = document.createElement('span');
      el.className = `dsts-badge dsts-badge--${data.badgeType || 'none'}`;
      el.innerHTML = `
        <span class="dsts-badge__icon">
          <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </span>
        <span>${escapeHtml(label)}</span>
      `;
      container.appendChild(el);
      return el;
    },

    /**
     * Render trust score ring
     * @param {HTMLElement} container
     * @param {{trustScore:number, size?:number}} data
     */
    renderTrustRing(container, data) {
      if (!container) return;
      const score = Math.max(0, Math.min(100, data.trustScore || 0));
      const size = data.size || 48;
      const circumference = 2 * Math.PI * ((size - 4) / 2);
      const offset = circumference - (score / 100) * circumference;
      const tier = score >= 90 ? 'elite' : score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

      const el = document.createElement('div');
      el.className = 'dsts-trust-ring';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.innerHTML = `
        <svg viewBox="0 0 ${size} ${size}">
          <circle class="dsts-trust-ring__bg" cx="${size / 2}" cy="${size / 2}" r="${(size - 4) / 2}"/>
          <circle class="dsts-trust-ring__fill" data-score="${tier}" cx="${size / 2}" cy="${size / 2}" r="${(size - 4) / 2}"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
        </svg>
        <span class="dsts-trust-ring__score">${score}</span>
      `;
      container.appendChild(el);
      return el;
    },

    /**
     * Render evidence pack preview
     * @param {HTMLElement} container
     * @param {{evidence:Array<{type:string,name:string,status:string}>, lang?:string}} data
     */
    renderEvidencePack(container, data) {
      if (!container) return;
      const lang = data.lang || (window.DSTS?.getLang?.() || 'vi');
      const items = data.evidence || [];

      const el = document.createElement('div');
      el.className = 'dsts-evidence-pack';
      el.innerHTML = `
        <div class="dsts-evidence-pack__header">
          <h4 class="dsts-evidence-pack__title">${lang === 'vi' ? 'Bằng chứng xác minh' : 'Verification Evidence'}</h4>
          <span class="dsts-evidence-pack__count">${items.length} ${lang === 'vi' ? 'mục' : 'items'}</span>
        </div>
        <div class="dsts-evidence-pack__list">
          ${items.map(item => {
            const icon = EVIDENCE_ICONS[item.type] || EVIDENCE_ICONS.default;
            const statusLabel = STATUS_LABELS[lang]?.[item.status] || item.status;
            return `
              <div class="dsts-evidence-item">
                <div class="dsts-evidence-item__icon dsts-evidence-item__icon--${item.status}">${icon}</div>
                <div class="dsts-evidence-item__name">${escapeHtml(item.name)}</div>
                <span class="dsts-evidence-item__status dsts-evidence-item__status--${item.status}">${escapeHtml(statusLabel)}</span>
              </div>
            `;
          }).join('') || `<p style="color:#94a3b8;font-size:13px">${lang === 'vi' ? 'Chưa có bằng chứng' : 'No evidence yet'}</p>`}
        </div>
      `;
      container.appendChild(el);
      return el;
    },

    /**
     * Quick render: badge + ring + evidence for a profile card
     * @param {HTMLElement} container
     * @param {{badgeType:string, trustScore:number, evidence:Array, lang?:string}} data
     */
    renderProfileTrust(container, data) {
      if (!container) return;
      container.innerHTML = '';

      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;align-items:center;gap:14px;flex-wrap:wrap';

      const badgeWrap = document.createElement('span');
      this.renderBadge(badgeWrap, data);

      const ringWrap = document.createElement('span');
      this.renderTrustRing(ringWrap, data);

      wrapper.appendChild(badgeWrap);
      wrapper.appendChild(ringWrap);
      container.appendChild(wrapper);

      if (data.evidence?.length) {
        const evidenceWrap = document.createElement('div');
        evidenceWrap.style.marginTop = '12px';
        this.renderEvidencePack(evidenceWrap, data);
        container.appendChild(evidenceWrap);
      }

      return wrapper;
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
