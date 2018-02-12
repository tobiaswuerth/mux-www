import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {routes} from './../../ecosystems/vue-router/Router';

import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'ArtistRecordDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  mixins: [AsyncDataLoader],
  
  data: () => {
    return {
      routes, requestsRunning: 0,
    };
  },
  
  props: {
    id: {}, name: {},
  },
  
  computed: {
    uriReleases: function() {
      return this.prepRoute(this.routes.private.artists.recordsLookup.releases);
    }, uriArtists: function() {
      return this.prepRoute(this.routes.private.artists.recordsLookup.artists);
    },
    
    variations: function() {
      return this.data.length;
    },
  },
  
  methods: {
    
    prepRoute: function(route) {
      return route.replace(':id', this.id).
        replace(':name', encodeURIComponent(this.name));
    },
    
    load: function() {
      if (this.state === this.states.loading) {
        return;
      }
      
      this.state = this.states.loading;
      
      this.$store.dispatch('artists/recordsById',
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
    
    play: function() {
      alert('todo play');
    },
  },
});
