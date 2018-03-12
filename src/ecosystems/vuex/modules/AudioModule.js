import {clone} from './../../../scripts/Utils';
import {baseUrl, routes} from './RepositoryModule';
import Store from './../Store';

let i = 0;
export const states = {
  defined: 1 << i++, ready: 1 << i++, loading: 1 << i++, playing: 1 << i++,
};

const emptyPlaylistEntry = {
  track: null,
  buffer: null,
  source: null,
  audioState: states.defined,
  startedAt: null,
  pausedAt: null,
};

let continueSource = function(entry, getters, commit) {
  let now = new Date();
  let timeMs = ((entry.pausedAt || now) - (entry.startedAt || now));
  let context = getters.context;
  entry.source = context.createBufferSource();
  let source = entry.source;
  
  entry.source.onended = function(v) {
    let index = getters.playlistIndex + 1;
    if ((getters.playlist.length) > index) {
      console.log('playing next');
      commit('playlistIndex', index);
    }
  };
  
  source.connect(context.destination);
  source.buffer = entry.buffer;
  source.start(0, timeMs / 1000);
  let timestamp = now - timeMs;
  entry.startedAt = new Date(timestamp);
  entry.audioState = states.playing;
};

let createEntry = function(entry, payload, getters, commit) {
  if (!payload.track) {
    return null;
  }
  entry = clone(emptyPlaylistEntry);
  entry.track = payload.track;
  entry.source = getters.context.createBufferSource();
  getters.playlist.unshift(entry);
  commit('playlistIndex', {suppressEvents: true, data: 0});
  entry = getters.currentEntry;
  return entry;
};

let loadSource = function(getters, entry) {
  // prepare request
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
      source.start(0);
      entry.startedAt = new Date();
      entry.audioState = states.playing;
    }).catch((r) => {
      console.error(r);
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
    playlistIndex: (s, payload) => {
      if (payload.suppressEvents) {
        s.playlistIndex = payload.data;
      } else {
        s.playlistIndex = payload;
        s.dispatch('audio/play');
      }
    },
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
      let entry = getters.currentEntry;
      if (!entry || payload.track) {
        entry = createEntry(entry, payload, getters, commit);
      }
      if (!entry) {
        return;
      }
      
      if (entry.audioState === states.defined) {
        loadSource(getters, entry);
      } else if (entry.audioState === states.ready) {
        continueSource(entry, getters, commit);
      }
      
    },
  },
};

