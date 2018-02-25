import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {paths} from './../../ecosystems/vue-router/Router';

import DataLoader from '../../scripts/DataLoader';

export default Vue.extend({
  name: 'ArtistReleaseDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  data: () => {
    return {
      dataLoader: new DataLoader('artists/releasesById'),
    };
  },
  
  props: {
    id: {}, name: {},
  },
  
  computed: {
    uriVariations: function() {
      return this.prepRoute(paths.private.artists.releasesLookup.variants);
    }, uriArtists: function() {
      return this.prepRoute(paths.private.artists.releasesLookup.artists);
    }, uriRecords: function() {
      return this.prepRoute(paths.private.artists.releasesLookup.records);
    },
    
    variations: function() {
      return this.dataLoader.dataSource.data.length;
    },
    
    countries: function() {
      let c = [];
      this.dataLoader.dataSource.data.filter(x => x.Country).
        map(x => x.Country).
        forEach(x => {
          if (c.indexOf(x) < 0) {
            c.push(x);
          }
        });
      return c;
    },
  },
  
  mounted: function() {
    this.dataLoader.load({id: this.id}, true).then(() => {
      // ignore
    }).catch((r) => {
      console.error(r);
    });
  },
  
  methods: {
    
    prepRoute: function(route) {
      return route.replace(':id', this.id).
        replace(':name', encodeURIComponent(this.name));
    },
    
  },
});
