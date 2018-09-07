import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {types as overlayTypes} from './../Overlay/Overlay';
import {paths} from './../../ecosystems/vue-router/Router';

import DataLoader from '../../scripts/DataLoader';
import {
  onAfterFilter, onAfterMap, onAfterUniqueByKey, simplyLoad, simplyLoadAll,
} from './../../scripts/DataLoaderUtils';
import {getBestMatchingTrack} from './../../scripts/DataUtils';
import Store from './../../ecosystems/vuex/Store';

export default Vue.extend({
  name: 'ArtistReleaseDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  data: () => {
    return {
      dataLoader: new DataLoader('artists/releasesById', this),
      countries: [],
      variations: 0,
    };
  },
  
  props: {
    id: {}, name: {},
  },
  
  computed: {
    uriVariations: function() {
      return this.prepRoute(paths.private.artists.releasesLookup.variants);
    }, uriArtists: function() {
      return this.prepRoute(paths.private.artists.releasesLookup.artists);
    }, uriRecords: function() {
      return this.prepRoute(paths.private.artists.releasesLookup.records);
    },
  },
  
  mounted: function() {
    this.dataLoader.onAfter = [
      onAfterFilter((i) => i.Title.normalize() === this.name.normalize()),
      this.postProcessing];
    this.dataLoader.load({id: this.id}, {doPreload: true}).catch(console.error);
  },
  
  methods: {
    
    postProcessing: function(p) {
      p.dataSource.data.filter(x => x.Country).
        map(x => x.Country).
        forEach(x => {
          this.variations++;
          if (this.countries.indexOf(x) < 0) {
            this.countries.push(x);
          }
        });
    },
    
    prepRoute: function(route) {
      return route.replace(':id', this.id).
        replace(':name', encodeURIComponent(this.name));
    },
    
    performListAdd: async function(mapper, audioRoute) {
      Store.dispatch('global/displayOverlay', {
        type: overlayTypes.spinner, display: true, text: 'Collecting data...',
      }).catch(console.error);
      
      // get all releases of this artist matching the given name
      let releaseIds = await simplyLoad('artists/releasesById', {id: this.id}, [
        onAfterFilter((i) => i.Title.normalize() === this.name.normalize()),
        onAfterMap((i) => Object.assign({id: i.UniqueId}))]).
        catch(console.error);
      
      // get all records of those releases
      let records = await simplyLoadAll('releases/recordsById', releaseIds,
        onAfterUniqueByKey('UniqueId')).catch(console.error);
      
      // get all tracks of those records
      let loaders = [];
      let entries = [];
      records.forEach((r) => {
        let loader = simplyLoad('records/tracksById', {id: r.UniqueId}).
          then((tracks) => {
            // prepare entry of best match
            let bestGuess = getBestMatchingTrack(tracks);
            entries.push(mapper(r, bestGuess));
          }).catch(console.error);
        loaders.push(loader);
      });
      
      await Promise.all(loaders).catch(console.error);
      
      Store.dispatch(`audio/${audioRoute}`, entries).
        catch(console.error);
    },
    
    addToCurrentPlaylist: async function() {
      return await this.performListAdd(
        (r, g) => Object.assign({}, {track: g.track, title: r.Title}),
        'addToCurrentPlaylist').catch(console.error);
    },
    
    addToPlaylist: async function() {
      return await this.performListAdd((r, g) => Object.assign({},
        {trackId: g.track.UniqueId, title: r.Title}), 'addToPlaylist').
        catch(console.error);
    },
    
    play: function() {
      let lastIdx = Store.getters['audio/playlist'].length;
      this.addToCurrentPlaylist().
        then(() => Store.dispatch('audio/setPlaylistIndex', lastIdx).
          catch(console.error));
    },
  },
});
