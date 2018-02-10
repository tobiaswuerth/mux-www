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
      dataVariations: {}, routes,
    };
  },
  
  props: {
    id: {}, name: {},
  },
  
  computed: {
    getVariationsByIdName: function() {
      return this.routes.private.artists.releasesLookup.variants.replace(':id',
        this.id).replace(':name', this.name);
    }, getArtistsByIdName: function() {
      return this.routes.private.artists.releasesLookup.artists.replace(':id',
        this.id).replace(':name', this.name);
    }, getRecordsByIdName: function() {
      return this.routes.private.artists.releasesLookup.root.replace(':id',
        this.id).replace(':name', this.name);
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
    
    loadReleases: function() {
      this.data.forEach(x => {
        this.$store.dispatch('releases/byId', {id: x.UniqueId}).then(v => {
          this.dataVariations = {
            data: [v.data], hasMore: v.hasMore,
          };
        }).catch(x => {
          console.error(x);
        });
      });
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
          } else {
            this.loadReleases();
          }
        }).catch(x => {
        console.error(x);
      }).finally(() => {
        this.state = this.states.ready;
      });
    },
    
  },
});
