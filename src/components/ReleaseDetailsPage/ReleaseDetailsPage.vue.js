import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {paths} from './../../ecosystems/vue-router/Router';
import DataLoader from '../../scripts/DataLoader';
import {onAfterSingle, simplyLoad} from './../../scripts/DataLoaderUtils';
import {getBestMatchingTrack} from './../../scripts/DataUtils';
import Store from './../../ecosystems/vuex/Store';

export default Vue.extend({
  name: 'ReleaseDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  data: () => {
    return {
      dataLoader: new DataLoader('releases/byId'),
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
  
    addToPlaylist: function() {
      simplyLoad('releases/recordsById', {id: this.id}).then((d) => {
        d.forEach((r) => {
          simplyLoad('records/tracksById', {id: r.UniqueId}).then((t) => {
            let matchEntry = getBestMatchingTrack(t);
            Store.dispatch('audio/addToPlaylist',
              {track: matchEntry.track, title: r.Title}).catch(console.error);
          }).catch(console.error);
        });
      }).catch(console.error);
    },
  
    play: function() {
      let performedPlay = false;
      simplyLoad('releases/recordsById', {id: this.id}).then((d) => {
        d.forEach((r) => {
          simplyLoad('records/tracksById', {id: r.UniqueId}).then((t) => {
            let matchEntry = getBestMatchingTrack(t);
            Store.dispatch('audio/addToPlaylist',
              {track: matchEntry.track, title: r.Title}).then(() => {
              if (!performedPlay) {
                performedPlay = true;
                let lastIdx = Store.getters['audio/playlist'].length - 1;
                Store.dispatch('audio/setPlaylistIndex', lastIdx).
                  catch(console.error);
              }
            }).catch(console.error);
          }).catch(console.error);
        });
      }).catch(console.error);
    },
    
  },
});
