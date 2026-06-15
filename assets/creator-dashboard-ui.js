/**
 * DSTS Layer 3 — Creator Dashboard UI Components
 * Talk Show Table, Referral Leaderboard, Revenue Summary Cards.
 */
(function () {
  if (window.DSTSDashboard) return;

  const T = {
    vi: {
      talkshows: 'Talk Show',
      date: 'Ngày',
      views: 'Lượt xem',
      revenue: 'Doanh thu',
      status: 'Trạng thái',
      referrals: 'Giới thiệu',
      referrer: 'Người giới thiệu',
      bonus: 'Thưởng',
      total: 'Tổng',
      active: 'Đang hoạt động',
      completed: 'Hoàn thành',
      upcoming: 'Sắp tới'
    },
    en: {
      talkshows: 'Talk Show',
      date: 'Date',
      views: 'Views',
      revenue: 'Revenue',
      status: 'Status',
      referrals: 'Referrals',
      referrer: 'Referrer',
      bonus: 'Bonus',
      total: 'Total',
      active: 'Active',
      completed: 'Completed',
      upcoming: 'Upcoming'
    }
  };

  window.DSTSDashboard = {
    lang: 'vi',

    setLang(l) { this.lang = l; },
    t(key) { return T[this.lang]?.[key] || key; },

    renderTalkShowTable(container, rows) {
      if (!container) return;
      const l = this.lang;
      const table = document.createElement('table');
      table.className = 'dsts-table';
      table.innerHTML = `
        <thead><tr>
          <th>${this.t('talkshows')}</th>
          <th>${this.t('date')}</th>
          <th>${this.t('views')}</th>
          <th>${this.t('revenue')}</th>
          <th>${this.t('status')}</th>
        </tr></thead>
        <tbody>
          ${(rows || []).map(r => `
            <tr>
              <td><strong>${escapeHtml(r.title)}</strong></td>
              <td>${escapeHtml(r.date)}</td>
              <td>${this.formatNumber(r.views)}</td>
              <td>${this.formatCurrency(r.revenue_vnd)}</td>
              <td><span class="dsts-pill dsts-pill--${r.status}">${this.t(r.status) || r.status}</span></td>
            </tr>
          `).join('') || `<tr><td colspan="5" style="text-align:center;color:#94a3b8">${l==='vi'?'Chưa có talk show nào':'No talk shows yet'}</td></tr>`}
        </tbody>
      `;
      container.appendChild(table);
      return table;
    },

    renderReferralLeaderboard(container, rows) {
      if (!container) return;
      const l = this.lang;
      const table = document.createElement('table');
      table.className = 'dsts-table';
      table.innerHTML = `
        <thead><tr>
          <th>#</th>
          <th>${this.t('referrer')}</th>
          <th>${this.t('referrals')}</th>
          <th>${this.t('bonus')}</th>
        </tr></thead>
        <tbody>
          ${(rows || []).map((r, i) => `
            <tr>
              <td><span class="dsts-rank">${i + 1}</span></td>
              <td><strong>${escapeHtml(r.name)}</strong></td>
              <td>${this.formatNumber(r.count)}</td>
              <td>${this.formatCurrency(r.bonus_vnd)}</td>
            </tr>
          `).join('') || `<tr><td colspan="4" style="text-align:center;color:#94a3b8">${l==='vi'?'Chưa có giới thiệu nào':'No referrals yet'}</td></tr>`}
        </tbody>
      `;
      container.appendChild(table);
      return table;
    },

    renderRevenueCards(container, data) {
      if (!container) return;
      const l = this.lang;
      const el = document.createElement('div');
      el.className = 'dsts-cards';
      el.innerHTML = `
        <div class="dsts-card">
          <div class="dsts-card__label">${l==='vi'?'Doanh thu 30 ngày':'Revenue 30d'}</div>
          <div class="dsts-card__value">${this.formatCurrency(data.revenue_30d || 0)}</div>
        </div>
        <div class="dsts-card">
          <div class="dsts-card__label">${l==='vi'?'Người theo dõi':'Followers'}</div>
          <div class="dsts-card__value">${this.formatNumber(data.follower_count || 0)}</div>
        </div>
        <div class="dsts-card">
          <div class="dsts-card__label">${l==='vi'?'Tỷ lệ giữ chân':'Retention'}</div>
          <div class="dsts-card__value">${(data.retention_rate || 0).toFixed(1)}%</div>
        </div>
        <div class="dsts-card">
          <div class="dsts-card__label">${l==='vi'?'Tỷ lệ chuyển đổi':'Conversion'}</div>
          <div class="dsts-card__value">${(data.conversion_rate || 0).toFixed(1)}%</div>
        </div>
      `;
      container.appendChild(el);
      return el;
    },

    formatNumber(n) {
      if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
      if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
      return n?.toString() || '0';
    },

    formatCurrency(vnd) {
      if (!vnd) return '0 VND';
      return new Intl.NumberFormat('vi-VN').format(vnd) + ' VND';
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
