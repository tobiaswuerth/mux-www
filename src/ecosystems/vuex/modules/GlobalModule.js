import Store from '../Store';
import {secondsToReadableString} from './../../../scripts/Utils';

let updateNotification = (payload) => {
  if (!('Notification' in window) || Notification.permission === 'denied') {
    return false;
  }
  
  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then((p) => {
      if (p === 'granted') {
        return updateNotification(payload);
      }
    }).catch(console.error);
  } else {
    let config = {
      silent: true, renotify: true, noscreen: true, direction: 'auto',
      lang: 'en',
      body: 'Now playing',
      icon: '/static/logos/android-chrome-48x48.png',
      tag: 'mux',
    };
  
    let sw = Store.getters['global/serviceWorker'];
    if (sw) {
      sw.showNotification(payload.title, config).catch(console.error);
      return true;
    } else {
      // try to display notification without ServiceWorker registration
      try {
        let n = new Notification(payload.title, config);
        n.addEventListener('click', () => {
          n.close();
          window.focus();
        });
        return true;
      } catch (e) {
        return false;
      }
    }
  }
};

let updateMediaSession = (payload) => {
  if (!('mediaSession' in navigator)) {
    return false;
  }
  
  navigator.mediaSession.metadata = new MediaMetadata({
    title: payload.title,
    artist: 'Now playing', album: secondsToReadableString(payload.duration),
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
    () => Store.dispatch('audio/pause').catch(console.error));
  navigator.mediaSession.setActionHandler('seekbackward',
    () => Store.dispatch('audio/moveTime', -10).catch(console.error));
  navigator.mediaSession.setActionHandler('seekforward',
    () => Store.dispatch('audio/moveTime', 10).catch(console.error));
  navigator.mediaSession.setActionHandler('previoustrack',
    () => Store.dispatch('audio/previous').catch(console.error));
  navigator.mediaSession.setActionHandler('nexttrack',
    () => Store.dispatch('audio/next').catch(console.error));
  
  return true;
};

export default {
  namespaced: true,
  
  state: {
    hints: [], overlayData: {}, serviceWorker: null,
  },
  
  getters: {
    hints: s => s.hints,
    overlayData: s => s.overlayData,
    serviceWorker: s => s.serviceWorker,
  },
  
  mutations: {
    hints: (s, payload) => s.hints = payload,
    overlayData: (s, payload) => s.overlayData = payload,
    serviceWorker: (s, payload) => s.serviceWorker = payload,
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
  
    async notify({dispatch}, payload) {
      let notified = updateMediaSession(payload) || updateNotification(payload);
      if (!notified) {
        dispatch('hint', 'Cannot notify');
      }
    },
  },
};
