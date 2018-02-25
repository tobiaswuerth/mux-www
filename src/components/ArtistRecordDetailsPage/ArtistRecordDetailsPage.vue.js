import Vue from 'vue';
import AsyncDataLoader from '../../scripts/DataLoader';
import SubContentHub from './../SubContentHub/SubContentHub';

export default Vue.extend({
  name: 'ArtistRecordDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  mixins: [AsyncDataLoader],
  
  props: {
    id: {}, name: {},
  },
  
  data: () => {
    return {
      rawData: [], recordIds: [], requestsRunning: 0,
    };
  },
  
  computed: {
    uriReleases: function() {
      return this.prepRoute(this.routes.private.artists.recordsLookup.releases);
    }, uriArtists: function() {
      return this.prepRoute(this.routes.private.artists.recordsLookup.artists);
    },
  },
  
  methods: {
    
    prepRoute: function(route) {
      return route.replace(':id', this.id).
        replace(':name', encodeURIComponent(this.name));
    },
    
    processLoadedAliases: function() {
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
    
    loadRecordAliases: function(recordId, pageIndex = 0) {
      this.requestsRunning++;
      
      // get artists of release
      this.$store.dispatch('records/aliasesById',
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
    
    play: function() {
      
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
