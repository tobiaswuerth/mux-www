import Router, {paths} from './../../ecosystems/vue-router/Router';
import {_} from 'underscore';
import DataLoader from './../../scripts/DataLoader';
import {onAfterMap} from './../../scripts/DataLoaderUtils';

const specificRoutes = [
  paths.private.artists.root,
  paths.private.records.root,
  paths.private.releases.root,
  paths.private.artists.search,
  paths.private.records.search,
  paths.private.releases.search,
  paths.private.tracks.root,
  paths.private.tracks.search];

export default {
  name: 'Toolbar',
  
  components: {
    Router,
  },
  
  mounted: function() {
    this.loaderArtists.onAfter = onAfterMap(i => Object.assign({
      icon: 'people',
      label: i.Name,
      value: paths.private.artists.lookup.replace(':name',
        encodeURIComponent(i.Name)),
    }));
    this.loaderReleases.onAfter = onAfterMap(i => Object.assign({
      icon: 'view_agenda',
      label: i.Title,
      value: paths.private.releases.lookup.replace(':name',
        encodeURIComponent(i.Title)),
    }));
    this.loaderRecords.onAfter = onAfterMap(i => Object.assign({
      icon: 'view_list',
      label: i.Title,
      value: paths.private.records.lookup.replace(':name',
        encodeURIComponent(i.Title)),
    }));
  },
  
  data: () => {
    return {
      loaderArtists: new DataLoader('artists/likeName', this),
      loaderReleases: new DataLoader('releases/likeName', this),
      loaderRecords: new DataLoader('records/likeName', this),
      query: '',
    };
  },
  
  computed: {
    currentRoute: function() {
      let name = encodeURIComponent(this.$route.params.name);
      let fullPath = this.$route.fullPath;
      let match;
      for (let r in specificRoutes) {
        let raw = specificRoutes[r];
        let custom = raw.replace(':name', name);
        if (custom === fullPath) {
          if (raw.indexOf(':name') < 0) {
            // root, find matching search sub route
            for (let k in specificRoutes) {
              let entry = specificRoutes[k];
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
  
    displayResults: function() {
      return !this.currentRoute && this.query.trim();
    },
  },
  
  watch: {
    query: _.debounce(function(searchTerm) {
      searchTerm = searchTerm.trim();
      if (this.currentRoute) {
        // context search
        let match = this.currentRoute.replace(':name',
          encodeURIComponent(searchTerm));
        Router.push(match);
        return;
      }
      
      if (!searchTerm) {
        return;
      }
      
      // search globally
      this.loaderArtists.reset();
      this.loaderReleases.reset();
      this.loaderRecords.reset();
      
      let payload = {name: searchTerm, pageSize: 5};
      let logError = (r) => { console.error(r); };
      this.loaderArtists.load(payload).catch(logError);
      this.loaderReleases.load(payload).catch(logError);
      this.loaderRecords.load(payload).catch(logError);
    }, 750),
  },
};
