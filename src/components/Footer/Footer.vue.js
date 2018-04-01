import Store from './../../ecosystems/vuex/Store';
import {states as audioStates} from './../../ecosystems/vuex/modules/AudioModule';
import {secondsToReadableString} from './../../scripts/Utils';
import Router, {paths} from './../../ecosystems/vue-router/Router';
import {getCurrentPlaylistEntryTimeMs} from './../../scripts/DataUtils';

export default {
  name: 'Footer',
  
  components: {
    Router,
  },
  
  data: () => {
    return {
      state: audioStates.ready,
      track: null,
      currentTime: 0,
      progress: 0,
      entry: {},
    };
  },
  
  computed: {
    routePlaylist: function() {
      return paths.private.playlist;
    },
    
    isLoading: function() {
      let entry = this.entry;
      return !entry || entry.audioState === audioStates.loading;
    },
  
    isReady: function() {
      return this.entry && (this.entry.audioState === audioStates.ready ||
        this.entry.audioState === audioStates.defined);
    },
  
    isPlaying: function() {
      return this.entry && this.entry.audioState === audioStates.playing;
    },
  
    currentTimeLabel: function() {
      return secondsToReadableString(this.currentTime);
    },
  
    trackDurationLabel: function() {
      return secondsToReadableString(
        this.entry.track ? this.entry.track.Duration : 0);
    },
  },
  
  mounted: function() {
    Store.watch(() => Store.getters['audio/playlistIndex'], (v) => {
      this.track = Store.getters['audio/playlist'][v];
    });
    
    setInterval(() => this.updateValues(), 1000);
  },
  
  methods: {
    getEntry: function() {
      return Store.getters['audio/currentEntry'] ||
        {audioState: audioStates.ready};
    },
  
    updateValues: function() {
      this.entry = this.getEntry();
      if (this.entry && this.entry.track) {
        let timeMs = getCurrentPlaylistEntryTimeMs(this.entry);
        this.currentTime = Math.round(timeMs / 1000);
        this.progress = Math.round(timeMs / 10 / this.entry.track.Duration);
      } else {
        this.progress = 0;
        this.currentTime = 0;
      }
    },
    
    mainAction: function() {
      if (this.isPlaying) {
        Store.dispatch('audio/pause').catch((r) => {
          console.error(r);
        });
      } else if (this.isReady) {
        Store.dispatch('audio/play', {continue: true}).catch((r) => {
          console.error(r);
        });
      }
    },
  
    next: function() {
      Store.dispatch('audio/next').catch(console.error);
    },
  
    previous: function() {
      Store.dispatch('audio/previous').catch(console.error);
    },
  
    progressClicked: function(e) {
      let progress = e.x / screen.width;
      let entry = Store.getters['audio/currentEntry'];
      if (!entry) {
        return;
      }
    
      let length = entry.track.Duration;
      let skipTo = length * progress;
      let currentTime = getCurrentPlaylistEntryTimeMs(entry) / 1000;
      let relativeChange = skipTo - currentTime;
      Store.dispatch('audio/moveTime', relativeChange).catch(console.error);
    },
  },
};
