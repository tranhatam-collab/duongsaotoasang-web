/**
 * DSTS Layer 4 — Sponsor Ecosystem UI Components
 * Campaign Manager, Impact Reports, Sponsor Wall.
 */
(function () {
  if (window.DSTSSponsor) return;

  const T = {
    vi: {
      campaign: 'Chiến dịch',
      sponsor: 'Nhà tài trợ',
      tier: 'Hạng',
      budget: 'Ngân sách',
      spent: 'Đã chi',
      roi: 'ROI',
      impact: 'Tác động',
      reach: 'Tiếp cận',
      engagement: 'Tương tác',
      conversion: 'Chuyển đổi',
      status: 'Trạng thái',
      active: 'Đang chạy',
      completed: 'Hoàn thành',
      draft: 'Bản nháp'
    },
    en: {
      campaign: 'Campaign',
      sponsor: 'Sponsor',
      tier: 'Tier',
      budget: 'Budget',
      spent: 'Spent',
      roi: 'ROI',
      impact: 'Impact',
      reach: 'Reach',
      engagement: 'Engagement',
      conversion: 'Conversion',
      status: 'Status',
      active: 'Active',
      completed: 'Completed',
      draft: 'Draft'
    }
  };

  window.DSTSSponsor = {
    lang: 'vi',
    setLang(l) { this.lang = l; },
    t(k) { return T[this.lang]?.[k] || k; },

    renderCampaignCard(container, data) {
      if (!container) return;
      const l = this.lang;
      const el = document.createElement('div');
      el.className = 'dsts-campaign-card';
      const progress = data.budget_vnd ? Math.round((data.spent_vnd || 0) / data.budget_vnd * 100) : 0;
      el.innerHTML = `
        <div class="dsts-campaign-card__header">
          <h4>${escapeHtml(data.title)}</h4>
          <span class="dsts-pill dsts-pill--${data.status}">${this.t(data.status)}</span>
        </div>
        <div class="dsts-campaign-card__sponsor">
          <img src="${escapeHtml(data.sponsor_logo || '/img/og-default.svg')}" alt="" width="32" height="32">
          <span>${escapeHtml(data.sponsor_name)}</span>
          <span class="dsts-campaign-card__tier">${escapeHtml(data.tier)}</span>
        </div>
        <div class="dsts-campaign-card__progress">
          <div class="dsts-campaign-card__bar" style="width:${progress}%"></div>
        </div>
        <div class="dsts-campaign-card__stats">
          <div><strong>${this.formatCurrency(data.budget_vnd)}</strong><br><small>${this.t('budget')}</small></div>
          <div><strong>${this.formatCurrency(data.spent_vnd || 0)}</strong><br><small>${this.t('spent')}</small></div>
          <div><strong>${progress}%</strong><br><small>Progress</small></div>
        </div>
      `;
      container.appendChild(el);
      return el;
    },

    renderImpactReport(container, data) {
      if (!container) return;
      const l = this.lang;
      const el = document.createElement('div');
      el.className = 'dsts-impact-report';
      el.innerHTML = `
        <h4>${escapeHtml(data.title)}</h4>
        <p class="dsts-impact-report__period">${escapeHtml(data.period)}</p>
        <div class="dsts-impact-report__grid">
          <div><strong>${this.formatNumber(data.reach)}</strong><br><small>${this.t('reach')}</small></div>
          <div><strong>${this.formatNumber(data.engagement)}</strong><br><small>${this.t('engagement')}</small></div>
          <div><strong>${this.formatNumber(data.conversion)}</strong><br><small>${this.t('conversion')}</small></div>
          <div><strong>${data.roi?.toFixed(1) || '0.0'}x</strong><br><small>${this.t('roi')}</small></div>
        </div>
      `;
      container.appendChild(el);
      return el;
    },

    renderSponsorWall(container, sponsors) {
      if (!container) return;
      const el = document.createElement('div');
      el.className = 'dsts-sponsor-wall';
      el.innerHTML = (sponsors || []).map(s => `
        <a href="${escapeHtml(s.website_url || '#')}" class="dsts-sponsor-tile" target="_blank" rel="noopener">
          <img src="${escapeHtml(s.logo_url || '/img/og-default.svg')}" alt="${escapeHtml(s.name)}">
          <span>${escapeHtml(s.name)}</span>
          <span class="dsts-sponsor-tile__tier">${escapeHtml(s.tier)}</span>
        </a>
      `).join('');
      container.appendChild(el);
      return el;
    },

    formatCurrency(vnd) {
      if (!vnd) return '0 VND';
      return new Intl.NumberFormat('vi-VN').format(vnd) + ' VND';
    },
    formatNumber(n) {
      if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
      if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
      return n?.toString() || '0';
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
