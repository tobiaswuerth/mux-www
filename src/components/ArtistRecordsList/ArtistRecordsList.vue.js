import List from './../List/List';
import {routes} from './../../ecosystems/vue-router/Router';

export default {
  name: 'ArtistRecordsList',
  
  components: {List},
  
  props: {
    id: {},
  },
  
  computed: {
    payload: function() {
      return {
        id: this.id,
      };
    },
  },
  
  data: () => {
    return {
      routes, route: 'artists/recordsById', valueKey: 'Title',
    };
  },
  
  methods: {
    onPostProcess: function(data) {
      let d = {};
      
      data.forEach(x => {
        if (!d[x.Title]) {
          d[x.Title] = {
            Title: x.Title, variations: 1,
          };
        } else {
          d[x.Title].variations++;
        }
      });
      
      return d;
    },
    
    destination: function(name) {
      return routes.private.artists.recordsLookup.replace(':id', this.id).
        replace(':name', encodeURIComponent(name));
    },
  },
};
