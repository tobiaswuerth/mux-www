import {clone} from '../../../scripts/DataUtils';
import {apiBase, routes} from './RepositoryModule';
import Store from './../Store';
import {getCurrentPlaylistEntryTimeMs} from './../../../scripts/DataUtils';

let i = 0;
export const states = {
  defined: 1 << i++, ready: 1 << i++, loading: 1 << i++, playing: 1 << i++,
};

const maxLoadRetry = 3;

const emptyPlaylistEntry = {
  track: null,
  buffer: null,
  source: null,
  title: null,
  audioState: states.defined,
  startedAt: null,
  pausedAt: null,
  key: null,
  loadRetryCount: 0,
};

let continueSource = async function(entry, getters, dispatch) {
  let now = new Date();
  let pausedAt = entry.pausedAt || now;
  let startedAt = entry.startedAt || now;
  let timeMs = Math.abs(pausedAt.getTime() - startedAt.getTime());
  let context = await dispatch('getContext').catch(console.error);
  
  await context.resume().catch(console.error);
  
  entry.source = context.createBufferSource();
  let source = entry.source;
  
  source.onended = function() {
    let currentTime = (getCurrentPlaylistEntryTimeMs(entry) / 1000) + .5;
    let playNext = currentTime >= entry.track.Duration;
    if (!playNext) {
      return;
    }
    
    dispatch('next').catch(console.error);
  };
  
  source.connect(context.destination);
  source.buffer = entry.buffer;
  entry.pausedAt = null;
  source.start(0, timeMs / 1000);
  entry.startedAt = new Date(now - timeMs);
  entry.audioState = states.playing;
};

let createEntry = async function(getters, dispatch, payload) {
  if (!payload.track) {
    return null;
  }
  let entry = clone(emptyPlaylistEntry);
  entry.track = payload.track;
  let context = await dispatch('getContext').catch(console.error);
  entry.source = context.createBufferSource();
  entry.key = Math.random();
  entry.title = payload.title || entry.track.Path;
  return entry;
};

async function loadSource(entry, getters, dispatch) {
  if (entry.audioState !== states.defined) {
    return Promise.resolve();
  }
  
  // prepare request
  entry.audioState = states.loading;
  let request = new XMLHttpRequest();
  let url = `${apiBase}${routes.get.files.byId(entry.track.UniqueId)}`;
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  let options = await Store.dispatch('auth/getAuthenticationHeaders').
    catch(console.error);
  let headers = options.headers;
  Object.keys(headers).forEach(h => request.setRequestHeader(h, headers[h]));
  
  // setup callback
  request.onload = function() {
    let audioData = request.response;
    let onError = (r) => {
      console.error(r);
      entry.audioState = states.defined;
    };
    
    dispatch('getContext').then((context) => {
      context.decodeAudioData(audioData).then((buffer) => {
        let source = entry.source;
        source.connect(context.destination);
        source.buffer = buffer;
        entry.buffer = buffer;
        
        if (getters.currentEntry.key === entry.key) {
          continueSource(entry, getters, dispatch).catch(console.error);
        } else {
          entry.audioState = states.ready;
        }
      }).catch(onError);
    }).catch(onError);
  };
  
  request.onerror = function() {
    entry.audioState = states.defined;
    entry.loadRetryCount++;
    let hint = `Loading '${entry.title}' failed. Try ${entry.loadRetryCount}/${maxLoadRetry}.`;
    let loadAgain = entry.loadRetryCount < maxLoadRetry;
    if (loadAgain) {
      hint += ' Retrying...';
      Store.dispatch('global/hint', hint).catch(console.error);
      loadSource(entry, getters, dispatch).catch(console.error);
    } else {
      Store.dispatch('global/hint', hint).catch(console.error);
    }
  };
  
  // execute
  return request.send();
}

export default {
  namespaced: true,
  
  state: {
    playlist: [], playlistIndex: 0, context: null,
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
    context: (s, payload) => s.context = payload,
  },
  
  actions: {
    initialize: function({commit, getters}) {
      if (!getters.context) {
        let context = new (window.AudioContext || window.webkitAudioContext)();
        commit('context', context);
      }
    },
    
    getContext: async function({dispatch, getters}) {
      if (!getters.context) {
        await dispatch('initialize').catch(console.error);
      }
      return getters.context;
    },
    
    pause: async function({commit, getters, dispatch}) {
      let entry = getters.currentEntry;
      if (!entry || entry.audioState !== states.playing) {
        // ignore call
        return Promise.resolve();
      }
      
      entry.source.stop(0);
      entry.pausedAt = new Date();
      entry.audioState = states.ready;
      let context = await dispatch('getContext').catch(console.error);
      return context.suspend();
    },
    
    play: async function({commit, getters, dispatch}, payload) {
      await dispatch('pause').catch(console.error);
      let entry = getters.currentEntry;
      
      // create new
      let playlist = getters.playlist;
      if (payload && payload.track) {
        await dispatch('addToPlaylist', payload).catch(console.error);
        await dispatch('setPlaylistIndex', playlist.length - 1).
          catch(console.error);
        return Promise.resolve();
      }
      
      if (!entry) {
        return Promise.resolve();
      }
      
      // load & continue
      if (entry.audioState === states.defined) {
        loadSource(entry, getters, dispatch).catch(console.error);
      } else if (entry.audioState === states.ready) {
        await continueSource(entry, getters, dispatch).catch(console.error);
      }
      
      // preload
      let nextItemIndex = getters.playlistIndex + 1;
      if (playlist.length > nextItemIndex) {
        let nextItem = playlist[nextItemIndex];
        if (nextItem.audioState === states.defined) {
          loadSource(nextItem, getters, dispatch).catch(console.error);
        }
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
        await dispatch('pause').catch(console.error);
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
      await dispatch('play').catch(console.error);
    },
    
    setPlaylistIndex: async function({commit, dispatch}, payload) {
      await dispatch('pause').catch(console.error);
      commit('playlistIndex', payload);
      await dispatch('play').catch(console.error);
    },
    
    addToPlaylist: async function({getters, dispatch}, payload) {
      // validate
      if (!payload.track) {
        return Promise.reject('undefined track');
      }
      
      // create
      let entry = await createEntry(getters, dispatch, payload).
        catch(console.error);
      if (!entry) {
        return Promise.reject('creation failed');
      }
      Store.dispatch('global/hint',
        {message: `Added '${entry.title}' to playlist`}).catch(console.error);
      
      // finalize
      let playlist = getters.playlist;
      playlist.push(entry);
      if (getters.playlistIndex >= playlist.length - 2) {
        // is next -> preload
        loadSource(entry, getters, dispatch).catch(console.error);
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
      await dispatch('setPlaylistIndex', index).catch(console.error);
      
      entry = getters.currentEntry;
      Store.dispatch('global/hint', {message: `Playing '${entry.title}'`}).
        catch(console.error);
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
      await dispatch('setPlaylistIndex', index).catch(console.error);
      
      entry = getters.currentEntry;
      Store.dispatch('global/hint', {message: `Playing '${entry.title}'`}).
        catch(console.error);
    },
  },
};

