import List from '../List/List';
import {routes} from './../../ecosystems/vue-router/Router';

export default {
  name: 'ArtistsList',
  
  components: {
    List,
  },
  
  data: () => {
    return {
      routes, route: 'artists/all', valueKey: 'Name',
    };
  },
  
  methods: {
    destination: function(value) {
      return this.routes.private.artists.lookup.replace(':name',
        encodeURIComponent(value));
    },
  },
};
