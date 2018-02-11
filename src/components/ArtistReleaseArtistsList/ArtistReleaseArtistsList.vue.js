import ArtistsListDetailed from '../ArtistsListDetailed/ArtistsListDetailed';
import Vue from 'vue';
import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'ArtistReleaseArtistsList',
  
  mixins: [AsyncDataLoader],
  
  props: {
    id: {}, name: {},
  },
  
  components: {
    ArtistsListDetailed,
  },
  
  data: () => {
    return {
      rawDataArtists: [], releasesIds: [], requestsRunning: 0,
    };
  },
  
  methods: {
    
    processLoadedArtists: function() {
      let e = [];
      
      this.rawDataArtists.forEach(x => {
        // validate
        let artist = x.Artist;
        if (!artist) {
          console.error('unexpected format');
          return;
        }
        
        if (e[artist.Name]) {
          // artist with same name already exists
          if (!e[artist.Name].find(y => y.UniqueId === artist.UniqueId)) {
            // .. but has different id -> add
            e[artist.Name].push(artist);
          }
        } else {
          // doesn't exist yet
          e[artist.Name] = [artist];
        }
      });
      
      // post process
      let d = [];
      Object.keys(e).forEach(x => {
        d = d.concat(e[x]);
      });
      
      this.data = {
        data: d, hasMore: false,
      };
    },
    
    loadArtist: function(releaseId, pageIndex = 0) {
      this.requestsRunning++;
      
      // get artists of release
      this.$store.dispatch('releases/artistsById',
        {id: releaseId, pageIndex: pageIndex}).
        then(v => {
          this.rawDataArtists = this.rawDataArtists.concat(v.data);
          if (v.hasMore) {
            this.loadArtist(releaseId, pageIndex + 1);
          }
        }).
        catch(x => {
          console.error(x);
        }).finally(() => {
        this.requestsRunning--;
        
        if (this.requestsRunning === 0) {
          // all fetching requests are done -> process
          this.processLoadedArtists();
        }
      });
    },
    
    loadArtists: function() {
      this.releasesIds.forEach(x => {
        this.loadArtist(x);
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
            this.loadArtists();
          }
        }).catch(x => {
        console.error(x);
      }).finally(() => {
        this.state = this.states.ready;
      });
    },
  },
});
