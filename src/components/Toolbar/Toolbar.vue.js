import {paths as artistPaths} from './../../ecosystems/vue-router/routes/ArtistsRoutes';
import {paths as recordPaths} from './../../ecosystems/vue-router/routes/RecordsRoutes';
import {paths as releasePaths} from './../../ecosystems/vue-router/routes/ReleasesRoutes';
import {_} from 'underscore';
import Store from './../../ecosystems/vuex/Store';
import Router from './../../ecosystems/vue-router/Router';

const relevantPaths = [
  artistPaths.root,
  recordPaths.root,
  releasePaths.root,
  artistPaths.search,
  recordPaths.search,
  releasePaths.search];

export default {
  name: 'Toolbar',
  
  data: () => {
    return {
      query: '',
    };
  },
  
  mounted: function() {
    if (this.currentRoute && this.$route.params.name) {
      this.query = this.$route.params.name;
    }
  },
  
  computed: {
    currentRoute: function() {
      let name = encodeURIComponent(this.$route.params.name);
      let fullPath = this.$route.fullPath;
      let match;
      for (let r in relevantPaths) {
        let raw = relevantPaths[r];
        let custom = raw.replace(':name', name);
        if (custom === fullPath) {
          if (raw.indexOf(':name') < 0) {
            // root, find matching search sub route
            for (let k in relevantPaths) {
              let entry = relevantPaths[k];
              if (entry.startsWith(raw) && raw !== entry) {
                match = entry;
                break;
              }
            }
          } else {
            match = raw;
          }
          break;
        }
      }
      return match;
    },
  },
  
  methods: {
    updateValue: function(val) {
      Store.commit('global/searchQuery', val);
      
      // update route
      let match = this.currentRoute;
      match = match.replace(':name', encodeURIComponent(val));
      Router.push(match);
    },
  },
  
  watch: {
    query: _.debounce(function(v) {
      this.updateValue(v);
    }, 750),
  },
};
