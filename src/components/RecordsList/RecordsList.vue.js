import List from './../List/List';
import {routes} from './../../ecosystems/vue-router/Router';

export default {
  name: 'RecordsList',
  
  components: {List},
  
  data: () => {
    return {
      routes, route: 'records/all', valueKey: 'Title',
    };
  },
  
  methods: {
    destination: function(name) {
      return routes.private.records.lookup.replace(':name',
        encodeURIComponent(name));
    },
  },
};
