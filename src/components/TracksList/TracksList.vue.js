import List from './../List/List';
import Routes from './../../ecosystems/vue-router/Routes';

export default {
  name: 'TracksList',
  
  components: {List},
  
  data: () => {
    return {
      routes: Routes,
      route: 'tracks/all',
      valueKey: 'UniqueId',
      doInsetDivider: true,
    };
  },
  
  methods: {
    toReadable: (duration) => {
      let minutes = Math.floor(duration / 60.0);
      let seconds = duration % 60.0;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(0)}`;
    },
    
    play: (id) => {
      // todo play
    },
    
    destination: () => {/*not used*/},
  },
};
