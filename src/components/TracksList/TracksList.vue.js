import List from './../List/List';
import Store from './../../ecosystems/vuex/Store';

export default {
  name: 'TracksList',
  
  components: {List},
  
  data: () => {
    return {
      route: 'tracks/all',
    };
  },
  
  methods: {
    toReadable: (duration) => {
      let minutes = Math.floor(duration / 60.0);
      let seconds = duration % 60.0;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(0)}`;
    },
    
    onClick: (item) => {
      Store.dispatch('audio/play', {track: item}).then(() => {
        // ignore
      }).catch((r) => {
        console.error(r);
      });
    },
  },
};
