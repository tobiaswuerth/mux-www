import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import ReleasesListDetailed from '../ReleasesListDetailed/ReleasesListDetailed';
import {routes} from './../../ecosystems/vue-router/Router';

import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'ArtistReleaseDetailsPage',
  
  components: {
    SubContentHub, ReleasesListDetailed,
  },
  
  mixins: [AsyncDataLoader],
  
  data: () => {
    return {
      dataVariations: {},
      routes,
      dataArtists: {},
      rawDataArtists: [],
      requestsRunning: 0,
    };
  },
  
  props: {
    id: {}, name: {},
  },
  
  computed: {
    uriVariations: function() {
      return this.prepRoute(
        this.routes.private.artists.releasesLookup.variants);
    }, uriArtists: function() {
      return this.prepRoute(this.routes.private.artists.releasesLookup.artists);
    }, uriRecords: function() {
      return this.prepRoute(this.routes.private.artists.releasesLookup.records);
    },
    
    variations: function() {
      return this.data.length;
    },
    
    countries: function() {
      let c = [];
      this.data.filter(x => x.Country).map(x => x.Country).forEach(x => {
        if (c.indexOf(x) < 0) {
          c.push(x);
        }
      });
      return c;
    },
  },
  
  methods: {
    
    prepRoute: function(route) {
      return route.replace(':id', this.id).replace(':name', this.name);
    },
    
    load: function() {
      if (this.state === this.states.loading) {
        return;
      }
      
      this.state = this.states.loading;
      
      this.$store.dispatch('artists/releasesById',
        {id: this.id, pageIndex: this.pageIndex}).
        then(v => {
          let relevant = v.data.filter(x => x.Title === this.name);
          this.data = this.data.concat(relevant);
          this.hasMore = v.hasMore;
          
          if (this.hasMore) {
            this.state = this.states.ready;
            this.loadMore();
          }
        }).catch(x => {
        console.error(x);
      }).finally(() => {
        this.state = this.states.ready;
      });
    },
    
  },
});
