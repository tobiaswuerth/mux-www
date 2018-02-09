import List from './../List/List';
import {routes} from './../../ecosystems/vue-router/Router';

export default {
  name: 'ReleasesList',
  
  components: {List},
  
  data: () => {
    return {
      routes, route: 'releases/all', valueKey: 'Title',
    };
  },
  
  methods: {
    destination: function(name) {
      return routes.private.releases.lookup.replace(':name',
        encodeURIComponent(name));
    },
  },
};
