/**
 * DSTS Layer 5 — Verified Seal & Expiry Alert Components
 * Displays trust status seal with expiry warning.
 */
(function () {
  if (window.DSTSTrustSeal) return;

  const STATUS_CONFIG = {
    verified: { icon: '✓', color: '#4ade80', label: { vi: 'Đã xác minh', en: 'Verified' } },
    pending: { icon: '⏳', color: '#fbbf24', label: { vi: 'Chờ duyệt', en: 'Pending' } },
    expired: { icon: '⚠', color: '#f87171', label: { vi: 'Hết hạn', en: 'Expired' } },
    revoked: { icon: '✕', color: '#94a3b8', label: { vi: 'Thu hồi', en: 'Revoked' } }
  };

  window.DSTSTrustSeal = {
    lang: 'vi',
    setLang(l) { this.lang = l; },

    renderSeal(container, data) {
      if (!container) return;
      const status = data.status || 'pending';
      const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
      const label = config.label[this.lang] || config.label.en;
      const expires = data.expires_at ? new Date(data.expires_at) : null;
      const daysLeft = expires ? Math.ceil((expires - new Date()) / (1000 * 60 * 60 * 24)) : null;
      const showWarning = daysLeft !== null && daysLeft <= 30 && status === 'verified';

      const el = document.createElement('div');
      el.className = `dsts-trust-seal dsts-trust-seal--${status}`;
      el.innerHTML = `
        <span class="dsts-trust-seal__icon" style="color:${config.color}">${config.icon}</span>
        <span class="dsts-trust-seal__label">${label}</span>
        ${showWarning ? `<span class="dsts-trust-seal__warning">${daysLeft}d</span>` : ''}
      `;

      if (showWarning) {
        el.title = this.lang === 'vi'
          ? `Hết hạn sau ${daysLeft} ngày. Gia hạn ngay.`
          : `Expires in ${daysLeft} days. Renew now.`;
      }

      container.appendChild(el);
      return el;
    },

    renderExpiryAlert(container, data) {
      if (!container) return;
      const expires = data.expires_at ? new Date(data.expires_at) : null;
      const daysLeft = expires ? Math.ceil((expires - new Date()) / (1000 * 60 * 60 * 24)) : null;
      if (daysLeft === null || daysLeft > 30 || data.status !== 'verified') return null;

      const l = this.lang;
      const urgent = daysLeft <= 7;
      const el = document.createElement('div');
      el.className = `dsts-expiry-alert ${urgent ? 'dsts-expiry-alert--urgent' : ''}`;
      el.innerHTML = `
        <span class="dsts-expiry-alert__icon">${urgent ? '🔴' : '🟡'}</span>
        <span class="dsts-expiry-alert__text">
          ${l === 'vi'
            ? `Xác minh hết hạn sau <strong>${daysLeft} ngày</strong>. Gia hạn ngay để giữ huy hiệu.`
            : `Verification expires in <strong>${daysLeft} days</strong>. Renew now to keep your badge.`}
        </span>
        <button class="dsts-expiry-alert__btn" onclick="window.location.href='/verified/renew'">
          ${l === 'vi' ? 'Gia hạn' : 'Renew'}
        </button>
      `;
      container.appendChild(el);
      return el;
    },

    renderFullTrustCard(container, data) {
      if (!container) return;
      container.innerHTML = '';
      this.renderSeal(container, data);
      this.renderExpiryAlert(container, data);
    }
  };
})();
