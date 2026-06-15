// DSTS Legacy Player Component
// Custom video/audio player for Story Preservation Engine

class LegacyPlayer {
  constructor(options = {}) {
    this.container = options.container;
    this.mediaUrl = options.mediaUrl;
    this.mediaType = options.mediaType || 'video'; // 'video' or 'audio'
    this.title = options.title || '';
    this.description = options.description || '';
    this.autoplay = options.autoplay || false;
    
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 1;
    
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
    if (this.autoplay) {
      this.play();
    }
  }

  render() {
    const mediaElement = this.mediaType === 'video' 
      ? `<video class="legacy-player__video" src="${this.mediaUrl}" preload="metadata"></video>`
      : `<audio class="legacy-player__audio" src="${this.mediaUrl}" preload="metadata"></audio>`;

    const containerHtml = this.mediaType === 'video'
      ? `<div class="legacy-player__video-container">${mediaElement}</div>`
      : `<div class="legacy-player__audio-container">${mediaElement}</div>`;

    this.container.innerHTML = `
      <div class="legacy-player">
        ${containerHtml}
        <div class="legacy-player__controls">
          <button class="legacy-player__play-btn" aria-label="Play/Pause">
            ▶
          </button>
          <div class="legacy-player__progress" role="slider" aria-label="Progress">
            <div class="legacy-player__progress-bar"></div>
          </div>
          <div class="legacy-player__time">
            0:00 / 0:00
          </div>
          <div class="legacy-player__volume">
            <button class="legacy-player__volume-btn" aria-label="Mute/Unmute">
              🔊
            </button>
            <input type="range" class="legacy-player__volume-slider" min="0" max="1" step="0.1" value="1" aria-label="Volume">
          </div>
          <button class="legacy-player__fullscreen-btn" aria-label="Fullscreen">
            ⛶
          </button>
        </div>
        <div class="legacy-player__info">
          <div class="legacy-player__title">${this.title}</div>
          <div class="legacy-player__description">${this.description}</div>
        </div>
        <div class="legacy-player__loading" style="display: none;">Loading...</div>
        <div class="legacy-player__error" style="display: none;">Failed to load media</div>
      </div>
    `;

    this.mediaElement = this.container.querySelector(
      this.mediaType === 'video' ? '.legacy-player__video' : '.legacy-player__audio'
    );
    this.playBtn = this.container.querySelector('.legacy-player__play-btn');
    this.progressBar = this.container.querySelector('.legacy-player__progress-bar');
    this.progress = this.container.querySelector('.legacy-player__progress');
    this.timeDisplay = this.container.querySelector('.legacy-player__time');
    this.volumeBtn = this.container.querySelector('.legacy-player__volume-btn');
    this.volumeSlider = this.container.querySelector('.legacy-player__volume-slider');
    this.fullscreenBtn = this.container.querySelector('.legacy-player__fullscreen-btn');
    this.loading = this.container.querySelector('.legacy-player__loading');
    this.error = this.container.querySelector('.legacy-player__error');
  }

  attachEventListeners() {
    // Play/Pause
    this.playBtn.addEventListener('click', () => this.togglePlay());
    
    // Media events
    this.mediaElement.addEventListener('play', () => this.onPlay());
    this.mediaElement.addEventListener('pause', () => this.onPause());
    this.mediaElement.addEventListener('timeupdate', () => this.onTimeUpdate());
    this.mediaElement.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
    this.mediaElement.addEventListener('progress', () => this.onProgress());
    this.mediaElement.addEventListener('waiting', () => this.onWaiting());
    this.mediaElement.addEventListener('canplay', () => this.onCanPlay());
    this.mediaElement.addEventListener('error', () => this.onError());
    
    // Progress bar
    this.progress.addEventListener('click', (e) => this.onSeek(e));
    
    // Volume
    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    this.volumeSlider.addEventListener('input', (e) => this.onVolumeChange(e));
    
    // Fullscreen
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.mediaElement.play();
  }

  pause() {
    this.mediaElement.pause();
  }

  onPlay() {
    this.isPlaying = true;
    this.playBtn.textContent = '⏸';
  }

  onPause() {
    this.isPlaying = false;
    this.playBtn.textContent = '▶';
  }

  onTimeUpdate() {
    this.currentTime = this.mediaElement.currentTime;
    this.updateProgress();
    this.updateTimeDisplay();
  }

  onLoadedMetadata() {
    this.duration = this.mediaElement.duration;
    this.updateTimeDisplay();
  }

  onProgress() {
    if (this.mediaElement.buffered.length > 0) {
      const bufferedEnd = this.mediaElement.buffered.end(this.mediaElement.buffered.length - 1);
      const bufferedPercent = (bufferedEnd / this.duration) * 100;
      this.progressBar.style.background = `linear-gradient(to right, var(--primary) ${bufferedPercent}%, var(--border) ${bufferedPercent}%)`;
    }
  }

  onWaiting() {
    this.loading.style.display = 'block';
  }

  onCanPlay() {
    this.loading.style.display = 'none';
  }

  onError() {
    this.error.style.display = 'block';
    this.error.textContent = 'Failed to load media. Please check your connection.';
  }

  onSeek(e) {
    const rect = this.progress.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.mediaElement.currentTime = percent * this.duration;
  }

  toggleMute() {
    this.mediaElement.muted = !this.mediaElement.muted;
    this.volumeBtn.textContent = this.mediaElement.muted ? '🔇' : '🔊';
  }

  onVolumeChange(e) {
    this.volume = parseFloat(e.target.value);
    this.mediaElement.volume = this.volume;
    this.volumeBtn.textContent = this.volume === 0 ? '🔇' : this.volume < 0.5 ? '🔉' : '🔊';
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  onKeyDown(e) {
    if (e.target.tagName === 'INPUT') return;
    
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.mediaElement.currentTime -= 5;
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.mediaElement.currentTime += 5;
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.volume = Math.min(1, this.volume + 0.1);
        this.mediaElement.volume = this.volume;
        this.volumeSlider.value = this.volume;
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.volume = Math.max(0, this.volume - 0.1);
        this.mediaElement.volume = this.volume;
        this.volumeSlider.value = this.volume;
        break;
      case 'f':
        e.preventDefault();
        this.toggleFullscreen();
        break;
      case 'm':
        e.preventDefault();
        this.toggleMute();
        break;
    }
  }

  updateProgress() {
    const percent = (this.currentTime / this.duration) * 100;
    this.progressBar.style.width = `${percent}%`;
  }

  updateTimeDisplay() {
    const current = this.formatTime(this.currentTime);
    const total = this.formatTime(this.duration);
    this.timeDisplay.textContent = `${current} / ${total}`;
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  destroy() {
    this.mediaElement.pause();
    this.mediaElement.src = '';
    this.container.innerHTML = '';
  }

  static create(options) {
    const player = new LegacyPlayer(options);
    return player;
  }
}

// Auto-initialize legacy players on page load
document.addEventListener('DOMContentLoaded', () => {
  const playerElements = document.querySelectorAll('[data-legacy-player]');
  
  playerElements.forEach(element => {
    const mediaUrl = element.dataset.mediaUrl;
    const mediaType = element.dataset.mediaType || 'video';
    const title = element.dataset.title || '';
    const description = element.dataset.description || '';
    const autoplay = element.dataset.autoplay === 'true';
    
    const player = new LegacyPlayer({
      container: element,
      mediaUrl,
      mediaType,
      title,
      description,
      autoplay
    });
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LegacyPlayer;
}
