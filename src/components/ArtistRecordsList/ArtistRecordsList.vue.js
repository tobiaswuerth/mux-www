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
      routes, route: 'artists/recordsById', valueKey: 'Title', doPreload: true,
    };
  },
  
  methods: {
    onPostProcess: function(data) {
      let titles = data.map(x => x.Title).sort();
      let uTitles = [...new Set(titles)];
      return uTitles.map(x => {
        return {
          Title: x,
        };
      });
    },
    
    destination: function(name) {
      return routes.private.artists.recordsLookup.root.replace(':id', this.id).
        replace(':name', encodeURIComponent(name));
    },
  },
};
