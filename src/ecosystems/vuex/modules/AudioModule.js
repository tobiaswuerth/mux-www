import {clone} from '../../../scripts/DataUtils';
import {baseUrl, routes} from './RepositoryModule';
import Store from './../Store';
import {getCurrentPlaylistEntryTimeMs} from './../../../scripts/DataUtils';

let i = 0;
export const states = {
  defined: 1 << i++, ready: 1 << i++, loading: 1 << i++, playing: 1 << i++,
};

const emptyPlaylistEntry = {
  track: null,
  buffer: null,
  source: null,
  title: null,
  audioState: states.defined,
  startedAt: null,
  pausedAt: null,
  key: null,
};

let continueSource = function(entry, getters, dispatch) {
  let now = new Date();
  let pausedAt = entry.pausedAt || now;
  let startedAt = entry.startedAt || now;
  let timeMs = Math.abs(pausedAt.getTime() - startedAt.getTime());
  let context = getters.context;
  entry.source = context.createBufferSource();
  let source = entry.source;
  
  source.onended = function() {
    let currentTime = (new Date().getTime() - entry.startedAt.getTime()) / 1000;
    let playNext = currentTime >= entry.track.Duration;
    if (!playNext) {
      return;
    }
    
    dispatch('next');
  };
  
  source.connect(context.destination);
  source.buffer = entry.buffer;
  entry.pausedAt = null;
  source.start(0, timeMs / 1000);
  entry.startedAt = new Date(now - timeMs);
  entry.audioState = states.playing;
};

let createEntry = function(getters, payload) {
  if (!payload.track) {
    return null;
  }
  let entry = clone(emptyPlaylistEntry);
  entry.track = payload.track;
  entry.source = getters.context.createBufferSource();
  entry.key = Math.random();
  entry.title = payload.title || entry.track.Path;
  return entry;
};

let loadSource = function(entry, getters, dispatch) {
  if (entry.audioState !== states.defined) {
    return;
  }
  
  // prepare request
  entry.audioState = states.loading;
  let request = new XMLHttpRequest();
  let url = `${baseUrl}${routes.get.files.byId(entry.track.UniqueId)}`;
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  let headers = Store.getters['auth/authHeader'];
  Object.keys(headers).forEach(h => {
    request.setRequestHeader(h, headers[h]);
  });
  
  // setup callback
  request.onload = function() {
    let audioData = request.response;
    getters.context.decodeAudioData(audioData).then((buffer) => {
      let source = entry.source;
      source.connect(getters.context.destination);
      source.buffer = buffer;
      entry.buffer = buffer;
  
      if (getters.currentEntry.key === entry.key) {
        continueSource(entry, getters, dispatch);
      } else {
        entry.audioState = states.ready;
      }
    }).catch((r) => {
      console.error(r);
      entry.audioState = states.defined;
    });
  };
  
  request.onerror = function() {
    entry.audioState = states.defined;
  };
  
  // execute
  request.send();
};

export default {
  namespaced: true,
  
  state: {
    playlist: [],
    playlistIndex: 0,
    context: new (window.AudioContext || window.webkitAudioContext)(),
  },
  
  getters: {
    playlist: s => s.playlist,
    playlistIndex: s => s.playlistIndex,
    currentEntry: s => s.playlist.length > 0
      ? s.playlist[s.playlistIndex]
      : null,
    context: s => s.context,
  },
  
  mutations: {
    playlist: (s, payload) => s.playlist = payload,
    playlistIndex: (s, payload) => s.playlistIndex = payload,
  },
  
  actions: {
    pause: async function({commit, getters}) {
      let entry = getters.currentEntry;
      if (!entry || entry.audioState !== states.playing) {
        // ignore call
        return Promise.resolve();
      }
      
      entry.source.stop(0);
      entry.pausedAt = new Date();
      entry.audioState = states.ready;
    },
  
    play: async function({commit, getters, dispatch}, payload) {
      await dispatch('pause');
      let entry = getters.currentEntry;
    
      // create new
      if (payload && payload.track) {
        await dispatch('addToPlaylist', payload);
        await dispatch('setPlaylistIndex', getters.playlist.length - 1);
        return;
      }
    
      if (!entry) {
        return Promise.resolve();
      }
    
      // load & continue
      if (entry.audioState === states.defined) {
        loadSource(entry, getters, dispatch);
      } else if (entry.audioState === states.ready) {
        continueSource(entry, getters, dispatch);
      }
    },
  
    setPlaylist: async function({commit, dispatch, getters}, payload) {
      // find current index
      let idx = null;
      let entry = getters.currentEntry;
      if (entry) {
        for (let i = 0; i < payload.length; i++) {
          if (payload[i].key === entry.key) {
            idx = i;
            break;
          }
        }
      }
    
      if (null === idx) {
        // currently playing item is not in list anymore
        await dispatch('pause');
        idx = 0;
      }
    
      // update values
      commit('playlist', payload);
      commit('playlistIndex', idx);
    },
  
    moveTime: async function({getters, dispatch}, payload) {
      let entry = getters.currentEntry;
      if (!entry) {
        return;
      }
      let timeMs = getCurrentPlaylistEntryTimeMs(entry) + (payload * 1000);
      entry.startedAt = new Date(new Date().getTime() - timeMs);
      await dispatch('play');
    },
    
    setPlaylistIndex: async function({commit, dispatch}, payload) {
      await dispatch('pause');
      commit('playlistIndex', payload);
      await dispatch('play');
    },
  
    addToPlaylist: async function({getters, dispatch}, payload) {
      // validate
      if (!payload.track) {
        return Promise.reject('undefined track');
      }
    
      // create
      let entry = createEntry(getters, payload);
      if (!entry) {
        return Promise.reject('creation failed');
      }
      Store.dispatch('global/hint',
        {message: `Added '${entry.title}' to playlist`}).catch(console.error);
      
      // finalize
      let playlist = getters.playlist;
      playlist.push(entry);
      if (playlist.length - 2 === getters.playlistIndex) {
        // is next -> preload
        loadSource(entry, getters, dispatch);
      }
    },
  
    next: async function({dispatch, getters}) {
      let index = getters.playlistIndex + 1;
      let playlist = getters.playlist;
      let threshold = playlist.length;
      if (index >= threshold) {
        index = 0; // end of list, start from beginning
      }
    
      let entry = getters.playlist[index];
      entry.startedAt = 0;
      entry.pausedAt = 0;
      await dispatch('setPlaylistIndex', index);
    
      entry = getters.currentEntry;
      Store.dispatch('global/hint', {message: `Playing '${entry.title}'`}).
        catch(console.error);
      
      let nextItemIndex = index + 1;
      if (playlist.length > nextItemIndex) {
        let nextItem = playlist[nextItemIndex];
        if (nextItem.audioState === states.defined) {
          loadSource(nextItem, getters, dispatch);
        }
      }
    },
  
    previous: async function({dispatch, getters}) {
      let index = getters.playlistIndex - 1;
      if (index < 0) {
        let threshold = getters.playlist.length;
        index = threshold > 0 ? threshold - 1 : 0; // beginning of list,
        // start from the end
      }
      let entry = getters.playlist[index];
      entry.startedAt = 0;
      entry.pausedAt = 0;
      await dispatch('setPlaylistIndex', index);
    
      entry = getters.currentEntry;
      Store.dispatch('global/hint', {message: `Playing '${entry.title}'`}).
        catch(console.error);
    },
  },
};

