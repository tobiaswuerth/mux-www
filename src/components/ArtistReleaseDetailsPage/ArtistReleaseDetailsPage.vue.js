import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {paths} from './../../ecosystems/vue-router/Router';

import DataLoader from '../../scripts/DataLoader';
import {onAfterFilter} from './../../scripts/DataLoaderUtils';

export default Vue.extend({
  name: 'ArtistReleaseDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  data: () => {
    return {
      dataLoader: new DataLoader('artists/releasesById'),
      countries: [],
      variations: 0,
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
  },
  
  mounted: function() {
    this.dataLoader.onAfter = [
      onAfterFilter((i) => i.Title.normalize() === this.name.normalize()),
      this.postProcessing];
    this.dataLoader.load({id: this.id}, {doPreload: true}).catch((r) => {
      console.error(r);
    });
  },
  
  methods: {
  
    postProcessing: function(p) {
      p.dataSource.data.filter(x => x.Country).
        map(x => x.Country).
        forEach(x => {
          this.variations++;
          if (this.countries.indexOf(x) < 0) {
            this.countries.push(x);
          }
        });
    },
    
    prepRoute: function(route) {
      return route.replace(':id', this.id).
        replace(':name', encodeURIComponent(this.name));
    },
    
  },
});
