// DSTS Timeline Component
// Interactive timeline for Story Preservation Engine

class Timeline {
  constructor(options = {}) {
    this.container = options.container;
    this.events = options.events || [];
    this.filter = options.filter || 'all';
    this.highlightedIds = options.highlightedIds || [];
  }

  getEventTypeLabel(type) {
    const labels = {
      birth: 'Birth',
      education: 'Education',
      career: 'Career',
      achievement: 'Achievement',
      family: 'Family',
      legacy: 'Legacy',
      other: 'Other'
    };
    return labels[type] || 'Other';
  }

  getEventTypeColor(type) {
    const colors = {
      birth: '#10b981',
      education: '#3b82f6',
      career: '#f59e0b',
      achievement: '#8b5cf6',
      family: '#ec4899',
      legacy: '#ef4444',
      other: '#6b7280'
    };
    return colors[type] || '#6b7280';
  }

  filterEvents() {
    if (this.filter === 'all') {
      return this.events;
    }
    return this.events.filter(event => event.type === this.filter);
  }

  render() {
    const filteredEvents = this.filterEvents();
    
    if (filteredEvents.length === 0) {
      return `
        <div class="timeline">
          <div class="timeline__empty">
            No events found
          </div>
        </div>
      `;
    }

    const timelineItems = filteredEvents.map((event, index) => {
      const isLeft = index % 2 === 0;
      const isHighlighted = this.highlightedIds.includes(event.id);
      const typeColor = this.getEventTypeColor(event.type);
      
      return `
        <div class="timeline__item timeline__item--${isLeft ? 'left' : 'right'} ${isHighlighted ? 'timeline__item--highlight' : ''}">
          <div class="timeline__date">${new Date(event.date).toLocaleDateString()}</div>
          <div class="timeline__title">${event.title}</div>
          <div class="timeline__description">${event.description || ''}</div>
          ${event.media_url ? `
            <div class="timeline__media">
              ${event.media_type === 'video' 
                ? `<video src="${event.media_url}" controls></video>`
                : `<img src="${event.media_url}" alt="${event.title}">`
              }
            </div>
          ` : ''}
          <div class="timeline__actions">
            <button class="timeline__action-btn timeline__action-btn--primary" data-action="view" data-id="${event.id}">
              View Details
            </button>
            <button class="timeline__action-btn" data-action="share" data-id="${event.id}">
              Share
            </button>
          </div>
        </div>
      `;
    }).join('');

    const filterButtons = ['all', 'birth', 'education', 'career', 'achievement', 'family', 'legacy', 'other'].map(type => `
      <button 
        class="timeline__filter-btn ${this.filter === type ? 'timeline__filter-btn--active' : ''}"
        data-filter="${type}"
      >
        ${this.getEventTypeLabel(type)}
      </button>
    `).join('');

    return `
      <div class="timeline">
        <div class="timeline__filter">
          ${filterButtons}
        </div>
        ${timelineItems}
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
    const filterButtons = this.container.querySelectorAll('.timeline__filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.filter = e.target.dataset.filter;
        this.mount();
      });
    });

    // Action buttons
    const actionButtons = this.container.querySelectorAll('.timeline__action-btn');
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
    const event = new CustomEvent('timelineAction', {
      detail: { action, id }
    });
    this.container.dispatchEvent(event);
  }

  setFilter(filter) {
    this.filter = filter;
    this.mount();
  }

  setHighlightedIds(ids) {
    this.highlightedIds = ids;
    this.mount();
  }

  addEvent(event) {
    this.events.push(event);
    this.mount();
  }

  removeEvent(id) {
    this.events = this.events.filter(e => e.id !== id);
    this.mount();
  }

  static create(options) {
    const timeline = new Timeline(options);
    return timeline.render();
  }

  static mount(options) {
    const timeline = new Timeline(options);
    return timeline.mount();
  }
}

// Auto-initialize timelines on page load
document.addEventListener('DOMContentLoaded', () => {
  const timelineElements = document.querySelectorAll('[data-timeline]');
  
  timelineElements.forEach(element => {
    const eventsData = element.dataset.events;
    const events = eventsData ? JSON.parse(eventsData) : [];
    const filter = element.dataset.filter || 'all';
    const highlightedIds = element.dataset.highlightedIds 
      ? JSON.parse(element.dataset.highlightedIds) 
      : [];
    
    const timeline = new Timeline({
      container: element,
      events,
      filter,
      highlightedIds
    });
    timeline.mount();
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Timeline;
}
