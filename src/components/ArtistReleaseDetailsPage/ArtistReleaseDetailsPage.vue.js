import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
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
      dataLoader: new DataLoader('artists/releasesById'),
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
  
    addToPlaylist: function() {
      // get all releases of this artist matching the given name
      simplyLoad('artists/releasesById', {id: this.id}, [
        onAfterFilter((i) => i.Title.normalize() === this.name.normalize()),
        onAfterMap((i) => Object.assign({id: i.UniqueId}))]).
        then((releaseIds) => {
          // get all records of those releases
          simplyLoadAll('releases/recordsById', releaseIds,
            onAfterUniqueByKey('UniqueId')).
            then((records) => {
              // get all tracks of those records
              records.forEach((s) => {
                simplyLoad('records/tracksById', {id: s.UniqueId}).
                  then((tracks) => {
                    // add best match to playlist
                    let bestGuess = getBestMatchingTrack(tracks);
                    Store.dispatch('audio/addToPlaylist',
                      {track: bestGuess.track, title: s.Title}).
                      catch(console.error);
                  }).
                  catch(console.error);
              });
            }).catch(console.error);
        }).catch(console.error);
    },
  
    play: function() {
      let performedPlay = false;
    
      // get all releases of this artist matching the given name
      simplyLoad('artists/releasesById', {id: this.id}, [
        onAfterFilter((i) => i.Title.normalize() === this.name.normalize()),
        onAfterMap((i) => Object.assign({id: i.UniqueId}))]).
        then((releaseIds) => {
          // get all records of those releases
          simplyLoadAll('releases/recordsById', releaseIds,
            onAfterUniqueByKey('UniqueId')).
            then((records) => {
              // get all tracks of those records
              records.forEach((s) => {
                simplyLoad('records/tracksById', {id: s.UniqueId}).
                  then((tracks) => {
                    // add best match to playlist
                    let bestGuess = getBestMatchingTrack(tracks);
                    Store.dispatch('audio/addToPlaylist',
                      {track: bestGuess.track, title: s.Title}).then(() => {
                      if (!performedPlay) {
                        performedPlay = true;
                        let lastIdx = Store.getters['audio/playlist'].length -
                          1;
                        Store.dispatch('audio/setPlaylistIndex', lastIdx).
                          catch(console.error);
                      }
                    }).catch(console.error);
                  }).
                  catch(console.error);
              });
            }).catch(console.error);
        }).catch(console.error);
    },
  },
});
