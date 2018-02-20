import ArtistsListDetailed from '../ArtistsListDetailed/ArtistsListDetailed';
import Vue from 'vue';
import AsyncDataLoader from '../../scripts/DataLoader';

export default Vue.extend({
  name: 'ArtistRecordArtistList',
  
  mixins: [AsyncDataLoader],
  
  props: {
    id: {}, name: {},
  },
  
  components: {
    ArtistsListDetailed,
  },
  
  data: () => {
    return {
      rawData: [], recordIds: [], requestsRunning: 0,
    };
  },
  
  methods: {
    
    processLoadedAliases: function() {
      let d = {};
      
      this.rawData.forEach(x => {
        if (!d[x.Artist.UniqueId]) {
          d[x.Artist.UniqueId] = x.Artist;
        }
      });
      
      d = Object.values(d);
      
      this.data = {
        data: d, hasMore: false,
      };
    },
    
    loadRecordAliases: function(recordId, pageIndex = 0) {
      this.requestsRunning++;
      
      // get artists of release
      this.$store.dispatch('records/artistsById',
        {id: recordId, pageIndex: pageIndex}).
        then(v => {
          this.rawData = this.rawData.concat(v.data);
          if (v.hasMore) {
            this.loadRecordAliases(recordId, pageIndex + 1);
          }
        }).
        catch(x => {
          console.error(x);
        }).finally(() => {
        this.requestsRunning--;
        
        if (this.requestsRunning === 0) {
          // all fetching requests are done -> process
          this.processLoadedAliases();
        }
      });
    },
    
    loadAliases: function() {
      this.recordIds.forEach(x => {
        this.loadRecordAliases(x);
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
            this.loadAliases();
          }
        }).catch(x => {
        console.error(x);
      }).finally(() => {
        this.state = this.states.ready;
      });
    },
  },
});
