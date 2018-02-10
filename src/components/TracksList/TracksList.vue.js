import List from './../List/List';
import {routes} from './../../ecosystems/vue-router/Router';

export default {
  name: 'TracksList',
  
  components: {List},
  
  data: () => {
    return {
      routes, route: 'tracks/all', valueKey: 'UniqueId',
    };
  },
  
  methods: {
    toReadable: (duration) => {
      let minutes = Math.floor(duration / 60.0);
      let seconds = duration % 60.0;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(0)}`;
    },
    
    destination: function(name) {
      return routes.private.tracks.details.replace(':id',
        encodeURIComponent(name));
    },
  },
};
