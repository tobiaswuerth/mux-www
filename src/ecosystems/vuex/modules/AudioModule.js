import {baseUrl, routes} from './RepositoryModule';
import Store from './../Store';

const states = {
  ready: 1 << 0, loading: 1 << 1, playing: 1 << 2,
};

export default {
  namespaced: true,
  
  state: {
    playlist: [],
    playlistIndex: -1,
    context: new (window.AudioContext || window.webkitAudioContext)(),
    source: null,
    states,
    state: states.ready,
  },
  
  getters: {
    playlist: s => s.playlist,
    playlistIndex: s => s.playlistIndex,
    context: s => s.context,
    source: s => s.source,
    state: s => s.state,
    states: s => s.states,
  },
  
  mutations: {
    playlist: (s, payload) => s.playlist = payload,
    playlistIndex: (s, payload) => s.playlistIndex = payload,
    source: (s, payload) => s.source = payload,
    state: (s, payload) => s.state = payload,
  },
  
  actions: {
    play: ({commit, getters}, payload) => {
      let track = payload.track;
      if (!track) {
        return;
      }
      
      let states = getters.states;
      commit('state', states.loading);
      
      // add track to playlist
      let playlist = getters.playlist;
      playlist.push(track);
      commit('playlist', playlist);
      
      // change index
      let index = playlist.indexOf(track);
      commit('playlistIndex', index);
      
      // cleanup old
      if (getters.source) {
        getters.source.stop();
      }
      
      // create new
      let context = getters.context;
      commit('source', context.createBufferSource());
      let source = getters.source;
      // todo events
  
      // prepare request
      let request = new XMLHttpRequest();
      let url = `${baseUrl}${routes.get.files.byId(track.UniqueId)}`;
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      let headers = Store.getters['auth/authHeader'];
      Object.keys(headers).forEach(h => {
        request.setRequestHeader(h, headers[h]);
      });
      
      request.onload = function() {
        let audioData = request.response;
        context.decodeAudioData(audioData).then((buffer) => {
          source.buffer = buffer;
          commit('state', states.playing);
          source.start(0);
        }).catch((r) => {
          console.error(r);
        });
      };
      
      // perform request
      
      request.send();
    },
  },
};
