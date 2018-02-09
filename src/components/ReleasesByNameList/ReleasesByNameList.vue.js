import {routes} from './../../ecosystems/vue-router/Router';
import Repeater from './../DataRepeater/DataRepeater';

export default {
  name: 'ReleasesByNameList',
  
  components: {
    Repeater,
  },
  
  data: () => {
    return {
      routes, route: 'releases/byName', valueKey: 'UniqueId',
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
    destination: function(id) {
      return routes.private.releases.details.replace(':id', id);
    },
  },
  
  props: {
    name: {},
  },
};
