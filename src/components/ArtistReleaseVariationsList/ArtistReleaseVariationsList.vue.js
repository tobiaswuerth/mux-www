import ReleasesListDetailed from '../ReleasesListDetailed/ReleasesListDetailed';
import Vue from 'vue';
import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'ArtistReleaseVariationsList',
  
  mixins: [AsyncDataLoader],
  
  props: {
    id: {}, name: {},
  },
  
  components: {
    ReleasesListDetailed,
  },
  
  data: () => {
    return {
      releasesIds: [], requestsRunning: 0,
    };
  },
  
  methods: {
    
    loadReleases: function() {
      this.releasesIds.forEach(x => {
        this.requestsRunning++;
        
        this.$store.dispatch('releases/byId', {id: x}).then(v => {
          this.data = {
            data: [v.data], hasMore: true, // has more -> show loading state
          };
        }).catch(x => {
          console.error(x);
        }).finally(() => {
          this.requestsRunning--;
          
          if (this.requestsRunning === 0) {
            // done with all
            this.data = {
              data: [], hasMore: false,
            };
          }
        });
      });
    },
    
    load: function() {
      // validate
      if (!this.hasMore || this.state === this.states.loading) {
        return;
      }
      
      this.state = this.states.loading;
      
      // get releases ids
      this.$store.dispatch('artists/releasesById',
        {id: this.id, pageIndex: this.pageIndex}).
        then(v => {
          let ids = v.data.filter(x => x.Title === this.name).
            map(x => x.UniqueId);
          this.releasesIds = this.releasesIds.concat(ids);
          this.hasMore = v.hasMore;
          
          if (this.hasMore) {
            this.state = this.states.ready;
            this.loadMore();
          } else {
            // all repeases fetched -> now go fetch artists
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
