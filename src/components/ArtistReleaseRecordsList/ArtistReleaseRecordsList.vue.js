import List from '../List/List';
import Vue from 'vue';
import AsyncDataLoader from '../../mixins/AsyncDataLoader';
import {routes} from './../../ecosystems/vue-router/Router';

export default Vue.extend({
  name: 'ArtistReleaseRecordsList',
  
  mixins: [AsyncDataLoader],
  
  props: {
    id: {}, name: {},
  },
  
  components: {
    List,
  },
  
  data: () => {
    return {
      routes,
      rawData: [],
      releasesIds: [],
      requestsRunning: 0,
      valueKey: 'Title',
    };
  },
  
  methods: {
    
    destination: function(name) {
      return this.routes.private.artists.recordsLookup.root.replace(':id',
        this.id).
        replace(':name', encodeURIComponent(name));
    },
    
    processLoadedRecords: function() {
      let names = this.rawData.map(x => [x.Title.toLowerCase(), x.Title]);
      names = new Map(names); // unique
      names = [...names.values()].sort();
      names = names.map(x => {
        return {
          Title: x,
        };
      });
      
      this.data = {
        data: names, hasMore: false,
      };
    },
    
    loadRecords: function() {
      this.releasesIds.forEach(x => {
        this.requestsRunning++;
        
        this.$store.dispatch('releases/recordsById', {id: x}).then(v => {
          this.rawData = this.rawData.concat(v.data);
        }).catch(x => {
          console.error(x);
        }).finally(() => {
          this.requestsRunning--;
          if (this.requestsRunning === 0) {
            this.processLoadedRecords();
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
            this.loadRecords();
          }
        }).catch(x => {
        console.error(x);
      }).finally(() => {
        this.state = this.states.ready;
      });
    },
  },
});
