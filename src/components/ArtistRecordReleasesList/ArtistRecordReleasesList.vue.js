import ReleasesListDetailed from '../ReleasesListDetailed/ReleasesListDetailed';
import Vue from 'vue';
import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'ArtistRecordArtistList',
  
  mixins: [AsyncDataLoader],
  
  props: {
    id: {}, name: {},
  },
  
  components: {
    ReleasesListDetailed,
  },
  
  data: () => {
    return {
      rawData: [], recordIds: [], requestsRunning: 0,
    };
  },
  
  methods: {
    
    processLoadedReleases: function() {
      let d = {};
      
      this.rawData.forEach(x => {
        if (!d[x.UniqueId]) {
          d[x.UniqueId] = x;
        }
      });
      
      d = Object.values(d);
      
      this.data = {
        data: d, hasMore: false,
      };
    },
    
    loadRecordReleases: function(recordId, pageIndex = 0) {
      this.requestsRunning++;
      
      // get artists of release
      this.$store.dispatch('records/releasesById',
        {id: recordId, pageIndex: pageIndex}).
        then(v => {
          this.rawData = this.rawData.concat(v.data);
          if (v.hasMore) {
            this.loadRecordReleases(recordId, pageIndex + 1);
          }
        }).
        catch(x => {
          console.error(x);
        }).finally(() => {
        this.requestsRunning--;
        
        if (this.requestsRunning === 0) {
          // all fetching requests are done -> process
          this.processLoadedReleases();
        }
      });
    },
    
    loadReleases: function() {
      this.recordIds.forEach(x => {
        this.loadRecordReleases(x);
      });
    },
    
    load: function() {
      // validate
      if (!this.hasMore || this.state === this.states.loading) {
        return;
      }
      
      this.state = this.states.loading;
      
      // get records ids
      this.$store.dispatch('artists/recordsById',
        {id: this.id, pageIndex: this.pageIndex}).
        then(v => {
          let ids = v.data.filter(x => x.Title === this.name).
            map(x => x.UniqueId);
          this.recordIds = this.recordIds.concat(ids);
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