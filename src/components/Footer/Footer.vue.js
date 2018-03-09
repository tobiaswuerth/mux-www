import Store from './../../ecosystems/vuex/Store';
import {states as audioStates} from './../../ecosystems/vuex/modules/AudioModule';

export default {
  name: 'Footer',
  
  data: () => {
    return {
      state: audioStates.ready,
      track: null,
      currentTime: 0,
      progress: 0,
      entry: null,
    };
  },
  
  computed: {
    isLoading: function() {
      let entry = this.entry;
      return !entry || entry.audioState === audioStates.loading ||
        entry.audioState === audioStates.defined;
    }, isReady: function() {
      return this.entry && this.entry.audioState === audioStates.ready;
    }, isPlaying: function() {
      return this.entry && this.entry.audioState === audioStates.playing;
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
    }, updateValues: function() {
      this.entry = this.getEntry();
      if (this.entry && this.entry.track) {
        let now = new Date();
        let started = this.entry.startedAt || now;
        let paused = this.entry.pausedAt || now;
        if (paused < started) {
          paused = now;
        }
        
        let bestGuess = Math.abs((paused - started) / 1000);
        let duration = this.entry.track.Duration;
        if (bestGuess > duration) {
          bestGuess = duration;
        }
        this.currentTime = Math.round(bestGuess);
        this.progress = this.currentTime * 100 / this.entry.track.Duration;
        this.currentTime = bestGuess;
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
  },
};
