import Store from '../Store';

let updateNotification = (payload) => {
  if (!('Notification' in window) || Notification.permission === 'denied') {
    return;
  }
  
  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then((p) => {
      if (p === 'granted') {
        updateNotification(payload);
      }
    }).catch(console.error);
  } else {
    let config = {
      lang: 'en',
      body: 'Now playing',
      icon: '/static/logos/android-chrome-48x48.png',
      silent: true,
      noscreen: true,
      tag: 'mux',
    };
    let n = new Notification(payload.title, config);
    n.addEventListener('click', () => {
      n.close();
      window.focus();
    });
  }
};

let updateMediaSession = (dispatch, payload) => {
  if (!('mediaSession' in navigator)) {
    return;
  }
  
  navigator.mediaSession.metadata = new MediaMetadata({
    title: payload.title,
    artist: 'Now playing',
    album: payload.duration,
    artwork: [
      {
        src: '/static/logos/android-chrome-36x36.png',
        sizes: '36x36',
        type: 'image/png',
      },
      {
        src: '/static/logos/android-chrome-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/static/logos/android-chrome-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/static/logos/android-chrome-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/static/logos/android-chrome-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/static/logos/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/static/logos/android-chrome-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/static/logos/android-chrome-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/static/logos/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },],
  });
  
  navigator.mediaSession.setActionHandler('play',
    () => Store.dispatch('audio/play', {continue: true}).catch(console.error));
  navigator.mediaSession.setActionHandler('pause',
    () => Store.dispatch('audio/pause')).catch(console.error);
  navigator.mediaSession.setActionHandler('seekbackward',
    () => Store.dispatch('audio/moveTime', -10).catch(console.error));
  navigator.mediaSession.setActionHandler('seekforward',
    () => Store.dispatch('audio/moveTime', 10).catch(console.error));
  navigator.mediaSession.setActionHandler('previoustrack',
    () => Store.dispatch('audio/previous').catch(console.error));
  navigator.mediaSession.setActionHandler('nexttrack',
    () => Store.dispatch('audio/next').catch(console.error));
};

export default {
  namespaced: true,
  
  state: {
    hints: [], overlayData: {},
  },
  
  getters: {
    hints: s => s.hints, overlayData: s => s.overlayData,
  },
  
  mutations: {
    hints: (s, payload) => s.hints = payload,
    overlayData: (s, payload) => s.overlayData = payload,
  },
  
  actions: {
    async hint({commit}, payload) {
      commit('hints', {
        message: payload.message || payload,
      });
    },
    
    async displayOverlay({dispatch, getters, commit}, payload) {
      commit('overlayData', payload);
    },
    
    async notify({}, payload) {
      updateNotification(payload);
      updateMediaSession(payload);
    },
  },
};
