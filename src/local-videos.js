// Loading a complete local file avoids unreliable browser range requests.
export function createLocalVideos(root = document.querySelector('.reveal .slides')) {
  const videos = [...(root?.querySelectorAll('video.slide-video') || [])];
  for (const video of videos) {
    for (const source of video.querySelectorAll('source[src]')) {
      source.dataset.localSrc = source.getAttribute('src');
      source.removeAttribute('src');
    }
    video.preload = 'none';
    video.load();
  }

  let deck;
  let active;
  const clear = () => {
    if (!active) return;
    const { video, controller, url } = active;
    active = undefined;
    controller.abort();
    video.pause();
    video.removeAttribute('src');
    video.load();
    delete video.dataset.videoState;
    if (url) URL.revokeObjectURL(url);
  };

  const load = async state => {
    const { video, controller } = state;
    const sources = [...video.querySelectorAll('source[data-local-src]')]
      .filter(source => video.canPlayType(source.type))
      .sort((a, b) => Number(b.type === 'video/webm') - Number(a.type === 'video/webm'));
    try {
      if (!sources.length) throw new Error('No supported video source');
      const response = await fetch(sources[0].dataset.localSrc, { signal: controller.signal });
      if (!response.ok) throw new Error(`Video request failed: ${response.status}`);
      const blob = await response.blob();
      if (active !== state) return;
      state.url = URL.createObjectURL(blob);
      video.src = state.url;
      video.load();
      if (video.hasAttribute('data-autoplay')) {
        video.muted = video.hasAttribute('muted');
        try {
          await video.play();
        } catch (error) {
          // The native controls remain available if autoplay is disallowed.
          if (error.name !== 'NotAllowedError') throw error;
        }
      }
      if (active === state) video.dataset.videoState = 'ready';
    } catch (error) {
      if (active === state && error.name !== 'AbortError') {
        video.dataset.videoState = 'error';
        console.error('Unable to load local slide video:', error);
      }
    }
  };

  const update = () => {
    const video = deck.getCurrentSlide()?.querySelector('video.slide-video');
    if (active?.video === video) return;
    clear();
    if (!video) return;
    active = { video, controller: new AbortController(), url: undefined };
    video.dataset.videoState = 'loading';
    void load(active);
  };

  return {
    id: 'local-videos',
    init(instance) {
      deck = instance;
      deck.on('ready', update);
      deck.on('slidechanged', update);
    },
    destroy() {
      clear();
      deck.off('ready', update);
      deck.off('slidechanged', update);
      for (const video of videos) {
        for (const source of video.querySelectorAll('source[data-local-src]')) {
          source.src = source.dataset.localSrc;
          delete source.dataset.localSrc;
        }
      }
    },
  };
}
