import {clone} from './../../../scripts/Utils';
import {baseUrl, routes} from './RepositoryModule';
import Store from './../Store';

let i = 0;
export const states = {
  defined: 1 << i++, ready: 1 << i++, loading: 1 << i++, playing: 1 << i++,
};

const emptyPlaylistEntry = {
  track: null,
  buffer: null, source: null, title: null,
  audioState: states.defined, startedAt: null, pausedAt: null, key: null,
};

let continueSource = function(entry, getters, dispatch) {
  let now = new Date();
  let pausedAt = entry.pausedAt || now;
  let startedAt = entry.startedAt || now;
  let timeMs = pausedAt.getTime() - startedAt.getTime();
  let context = getters.context;
  entry.source = context.createBufferSource();
  let source = entry.source;
  
  entry.source.onended = function(v) {
    let playNext = Math.round(v.srcElement.context.currentTime) >
      Math.round(entry.track.Duration);
    if (playNext) {
      dispatch('next').catch(console.error);
    }
  };
  
  source.connect(context.destination);
  source.buffer = entry.buffer;
  source.start(0, timeMs / 1000);
  let timestamp = now.getTime() - timeMs;
  console.log(timestamp);
  entry.startedAt = new Date(timestamp);
  entry.audioState = states.playing;
};

let prependNewEntry = function(entry, payload, getters, commit) {
  if (!payload.track) {
    return null;
  }
  entry = clone(emptyPlaylistEntry);
  entry.track = payload.track;
  entry.source = getters.context.createBufferSource();
  entry.key = Math.random();
  entry.title = payload.title || entry.track.Path;
  getters.playlist.unshift(entry);
  commit('playlistIndex', 0);
  return entry;
};

let loadSource = function(entry, getters) {
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
        source.start(0);
        entry.startedAt = new Date();
        entry.audioState = states.playing;
      }
    }).catch((r) => {
      console.error(r);
      entry.audioState = states.defined;
    });
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
    async pause({commit, getters}) {
      let entry = getters.currentEntry;
      if (!entry || entry.audioState !== states.playing) {
        // ignore call
        return Promise.resolve();
      }
      
      entry.source.stop(0);
      entry.pausedAt = new Date();
      entry.audioState = states.ready;
    },
    
    async play({commit, getters, dispatch}, payload) {
      await dispatch('pause');
      console.log('play');
      let entry = getters.currentEntry;
      if (!entry || (payload && payload.track)) {
        entry = prependNewEntry(entry, payload, getters, commit);
      }
      if (!entry) {
        return Promise.resolve();
      }
      
      if (entry.audioState === states.defined) {
        loadSource(entry, getters);
      } else if (entry.audioState === states.ready) {
        continueSource(entry, getters, dispatch);
      }
    },
  
    async setPlaylist({commit, dispatch, getters}, payload) {
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
  
    async setPlaylistIndex({commit, dispatch}, payload) {
      commit('playlistIndex', payload);
      await dispatch('play');
    },
  
    async next({dispatch, getters}) {
      let index = getters.playlistIndex + 1;
      let threshold = getters.playlist.length;
      if (index >= threshold) {
        index = 0; // end of list, start from beginning
      }
    
      await dispatch('setPlaylistIndex', index).catch(console.error);
    },
  
    async previous({dispatch, getters}) {
      let index = getters.playlistIndex - 1;
      if (index < 0) {
        let threshold = getters.playlist.length;
        index = threshold > 0 ? threshold - 1 : 0; // beginning of list,
        // start from the end
      }
      await dispatch('setPlaylistIndex', index).catch(console.error);
    },
  },
};

