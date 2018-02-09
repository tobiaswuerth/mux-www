import List from '../List/List';
import {routes} from './../../ecosystems/vue-router/Router';

export default {
  name: 'ArtistsList',
  
  components: {
    List,
  },
  
  props: {
    name: {},
  },
  
  data: () => {
    return {
      routes, route: 'artists/byName', doPreload: true, valueKey: 'UniqueId',
    };
  },
  
  computed: {
    payload: function() {
      return {
        name: this.name,
      };
    },
  },
  
  methods: {
    destination: function(value) {
      return this.routes.private.artists.details.replace(':id',
        encodeURIComponent(value));
    },
  },
};

