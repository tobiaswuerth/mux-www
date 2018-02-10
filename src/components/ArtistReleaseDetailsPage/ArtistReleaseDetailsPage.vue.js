import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import ReleasesListDetailed from '../ReleasesListDetailed/ReleasesListDetailed';
import ArtistsListDetailed from '../ArtistsListDetailed/ArtistsListDetailed';
import {routes} from './../../ecosystems/vue-router/Router';

import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'ArtistReleaseDetailsPage',
  
  components: {
    SubContentHub, ReleasesListDetailed, ArtistsListDetailed,
  },
  
  mixins: [AsyncDataLoader],
  
  data: () => {
    return {
      dataVariations: {},
      routes,
      dataArtists: {},
      rawDataArtists: [],
      dataArtistsRunning: 0,
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
    
    processLoadedArtists: function() {
      let e = [];
      
      this.rawDataArtists.forEach(x => {
        // validate
        let artist = x.Artist;
        if (!artist) {
          console.error('unexpected format');
          return;
        }
        
        // unique
        if (e[artist.Name]) {
          // already artist with same name
          if (e[artist.Name].find(y => y.UniqueId === artist.UniqueId)) {
            // already artist with same id -> skip
            return;
          }
          
          // same name, different id -> add
          e[artist.Name].push(artist);
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
      
      this.dataArtists = {
        data: d, hasMore: false,
      };
    },
    
    loadArtist: function(id, pageIndex = 0) {
      this.dataArtistsRunning++;
      this.$store.dispatch('releases/artistsById',
        {id: id, pageIndex: pageIndex}).
        then(v => {
          this.rawDataArtists = this.rawDataArtists.concat(v.data);
          if (v.hasMore) {
            this.loadArtist(id, pageIndex + 1);
          }
        }).
        catch(x => {
          console.error(x);
        }).finally(() => {
        this.dataArtistsRunning--;
        
        if (this.dataArtistsRunning === 0) {
          this.processLoadedArtists();
        }
      });
    },
    
    loadArtists: function() {
      this.data.forEach(x => {
        this.loadArtist(x.UniqueId);
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
