import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {paths} from './../../ecosystems/vue-router/Router';
import DataLoader from '../../scripts/DataLoader';
import {onAfterSingle} from './../../scripts/DataLoaderUtils';

export default Vue.extend({
  name: 'ReleaseDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  data: () => {
    return {
      dataLoader: new DataLoader('releases/byId'),
    };
  },
  
  props: {
    id: {},
  },
  
  computed: {
    uriVariations: function() {
      return this.dataLoader.dataSource.data.Title
        ? paths.private.releases.lookup.replace(':name',
          encodeURIComponent(this.dataLoader.dataSource.data.Title))
        : '';
    }, uriArtists: function() {
      return this.prepRoute(paths.private.releases.artists);
    }, uriRecords: function() {
      return this.prepRoute(paths.private.releases.records);
    },
    
  },
  
  mounted: function() {
    this.dataLoader.onAfter = onAfterSingle;
    this.dataLoader.load({id: this.id}, true).catch((r) => {
      console.error(r);
    });
  },
  
  methods: {
    
    prepRoute: function(route) {
      return route.replace(':id', this.id);
    },
    
  },
});
