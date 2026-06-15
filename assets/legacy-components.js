/**
 * DSTS Layer 2 — Story Preservation Engine UI Components
 * Legacy Player, Timeline, Family Tree.
 */
(function () {
  if (window.DSTSLegacy) return;

  const T = {
    vi: { timeline: 'Dòng thời gian', familyTree: 'Cây gia đình', archive: 'Lưu trữ', play: 'Phát', pause: 'Tạm dừng' },
    en: { timeline: 'Timeline', familyTree: 'Family Tree', archive: 'Archive', play: 'Play', pause: 'Pause' }
  };

  window.DSTSLegacy = {
    lang: 'vi',
    setLang(l) { this.lang = l; },
    t(k) { return T[this.lang]?.[k] || k; },

    renderTimeline(container, events) {
      if (!container) return;
      const l = this.lang;
      const el = document.createElement('div');
      el.className = 'dsts-timeline';
      el.innerHTML = `
        <h3 class="dsts-timeline__title">${this.t('timeline')}</h3>
        <div class="dsts-timeline__line">
          ${(events || []).map((ev, i) => `
            <div class="dsts-timeline__event ${i % 2 === 0 ? 'dsts-timeline__event--left' : 'dsts-timeline__event--right'}">
              <div class="dsts-timeline__dot"></div>
              <div class="dsts-timeline__card">
                <div class="dsts-timeline__year">${escapeHtml(ev.year)}</div>
                <div class="dsts-timeline__label">${escapeHtml(ev.label)}</div>
                <p class="dsts-timeline__desc">${escapeHtml(ev.description)}</p>
              </div>
            </div>
          `).join('') || `<p style="color:#94a3b8;padding:20px">${l==='vi'?'Chưa có sự kiện nào':'No events yet'}</p>`}
        </div>
      `;
      container.appendChild(el);
      return el;
    },

    renderFamilyTree(container, treeData) {
      if (!container) return;
      const l = this.lang;
      const el = document.createElement('div');
      el.className = 'dsts-family-tree';

      function renderNode(node, depth = 0) {
        if (!node) return '';
        const childrenHtml = (node.children || []).map(c => renderNode(c, depth + 1)).join('');
        return `
          <div class="dsts-family-tree__node" style="margin-left:${depth * 24}px">
            <div class="dsts-family-tree__person">
              <img src="${escapeHtml(node.avatar || '/img/og-default.svg')}" alt="">
              <div>
                <strong>${escapeHtml(node.name)}</strong>
                <span>${escapeHtml(node.relation || '')}</span>
              </div>
            </div>
            ${childrenHtml ? `<div class="dsts-family-tree__children">${childrenHtml}</div>` : ''}
          </div>
        `;
      }

      el.innerHTML = `
        <h3 class="dsts-family-tree__title">${this.t('familyTree')}</h3>
        <div class="dsts-family-tree__root">${renderNode(treeData)}</div>
      `;
      container.appendChild(el);
      return el;
    },

    renderLegacyPlayer(container, media) {
      if (!container) return;
      const l = this.lang;
      const el = document.createElement('div');
      el.className = 'dsts-legacy-player';
      el.innerHTML = `
        <div class="dsts-legacy-player__media">
          ${media?.video_url
            ? `<video controls poster="${escapeHtml(media.cover_url || '')}">
                 <source src="${escapeHtml(media.video_url)}" type="video/mp4">
               </video>`
            : media?.audio_url
              ? `<audio controls src="${escapeHtml(media.audio_url)}"></audio>`
              : `<div class="dsts-legacy-player__placeholder">
                   <span>🎬</span>
                   <p>${l==='vi'?'Chưa có nội dung media':'No media content'}</p>
                 </div>`
          }
        </div>
        <div class="dsts-legacy-player__meta">
          <h4>${escapeHtml(media?.title || 'Untitled')}</h4>
          <p>${escapeHtml(media?.description || '')}</p>
          <div class="dsts-legacy-player__tags">
            ${(media?.tags || []).map(t => `<span class="dsts-pill">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      `;
      container.appendChild(el);
      return el;
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
