// DSTS Verified Seal Component
// Displays verification seal for verified entities

export function renderVerifiedSeal(entity, options = {}) {
  const {
    size = 'medium', // small, medium, large
    showTooltip = true,
    clickable = true
  } = options;

  if (!entity || entity.status !== 'verified') {
    return null;
  }

  const sizes = {
    small: { width: 16, height: 16, fontSize: 10 },
    medium: { width: 24, height: 24, fontSize: 12 },
    large: { width: 32, height: 32, fontSize: 14 }
  };

  const { width, height, fontSize } = sizes[size] || sizes.medium;

  const badgeColors = {
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2'
  };

  const badgeColor = badgeColors[entity.badge_type] || badgeColors.silver;

  const seal = document.createElement('div');
  seal.className = 'dsts-verified-seal';
  seal.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${width}px;
    height: ${height}px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${badgeColor}, #8B8B8B);
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    cursor: ${clickable ? 'pointer' : 'default'};
    position: relative;
  `;

  seal.innerHTML = `
    <svg width="${width * 0.6}" height="${height * 0.6}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
    </svg>
  `;

  if (showTooltip) {
    const tooltip = document.createElement('div');
    tooltip.className = 'dsts-verified-tooltip';
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 8px;
      padding: 8px 12px;
      background: rgba(11, 17, 29, 0.95);
      color: #e2e8f0;
      font-size: ${fontSize}px;
      border-radius: 8px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s, visibility 0.2s;
      pointer-events: none;
      z-index: 1000;
    `;
    tooltip.textContent = `Verified ${entity.entity_type} · Trust Score: ${entity.trust_score || 0}`;
    seal.appendChild(tooltip);

    seal.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
    });

    seal.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
    });
  }

  if (clickable) {
    seal.addEventListener('click', () => {
      window.open(`/verified/${entity.entity_slug}`, '_blank');
    });
  }

  return seal;
}

export function renderVerifiedBadge(entity, options = {}) {
  const {
    size = 'medium',
    showScore = true
  } = options;

  if (!entity || entity.status !== 'verified') {
    return null;
  }

  const badge = document.createElement('div');
  badge.className = 'dsts-verified-badge';
  badge.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: linear-gradient(135deg, rgba(224,200,150,0.2), rgba(224,200,150,0.05));
    border: 1px solid rgba(224,200,150,0.3);
    font-size: ${size === 'small' ? '11px' : size === 'large' ? '14px' : '12px'};
    font-weight: 600;
    color: #e0c896;
  `;

  badge.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
    </svg>
    <span>Verified</span>
  `;

  if (showScore) {
    const scoreSpan = document.createElement('span');
    scoreSpan.style.cssText = `
      opacity: 0.7;
      font-weight: 400;
    `;
    scoreSpan.textContent = `· ${entity.trust_score || 0}`;
    badge.appendChild(scoreSpan);
  }

  return badge;
}
