import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {paths} from './../../ecosystems/vue-router/Router';
import DataLoader from '../../scripts/DataLoader';
import {onAfterSingle, simplyLoad} from './../../scripts/DataLoaderUtils';
import {getBestMatchingTrack} from './../../scripts/DataUtils';
import Store from './../../ecosystems/vuex/Store';
import {types as overlayTypes} from './../Overlay/Overlay.vue';

export default Vue.extend({
  name: 'ReleaseDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  data: () => {
    return {
      dataLoader: new DataLoader('releases/byId', this),
    };
  },
  
  props: {
    id: {},
  },
  
  computed: {
    uriVariations: function() {
      return this.prepRoute(paths.private.releases.variations);
    }, uriArtists: function() {
      return this.prepRoute(paths.private.releases.artists);
    }, uriRecords: function() {
      return this.prepRoute(paths.private.releases.records);
    },
    
  },
  
  mounted: function() {
    this.dataLoader.onAfter = onAfterSingle;
    this.dataLoader.load({id: this.id}, true).catch(console.error);
  },
  
  methods: {
    
    prepRoute: function(route) {
      return route.replace(':id', this.id);
    },
  
    performListAdd: async function(mapper, audioRoute) {
      Store.dispatch('global/displayOverlay', {
        type: overlayTypes.spinner, display: true, text: 'Collecting data...',
      }).catch(console.error);
    
      let records = await simplyLoad('releases/recordsById', {id: this.id}).
        catch(console.error);
    
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
