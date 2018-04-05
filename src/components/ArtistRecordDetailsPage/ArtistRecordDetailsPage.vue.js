import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {paths} from './../../ecosystems/vue-router/Router';
import {prepareRoute} from './../../ecosystems/vue-router/RouterUtils';
import {
  onAfterFilter, onAfterMap, simplyLoad, simplyLoadAll,
} from './../../scripts/DataLoaderUtils';
import Store from './../../ecosystems/vuex/Store';
import {matchScale, secondsToReadableString} from './../../scripts/Utils';
import {getBestMatchingTrack} from './../../scripts/DataUtils';

export default Vue.extend({
  name: 'ArtistRecordDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  props: {
    id: {}, name: {}, generic1: {},
  },
  
  data: () => {
    return {
      track: null,
      match: 0,
      aliases: '',
      isLoading: true,
      duration: '',
      disambiguation: '',
    };
  },
  
  computed: {
    uriReleases: function() {
      return prepareRoute(this.generic1
        ? paths.private.artists.recordsLookup.releasesFull
        : paths.private.artists.recordsLookup.releasesShort, {
        id: this.id, name: this.name, 'generic1?': this.generic1,
      });
    }, uriArtists: function() {
      return prepareRoute(this.generic1
        ? paths.private.artists.recordsLookup.artistsFull
        : paths.private.artists.recordsLookup.artistsShort, {
        id: this.id, name: this.name, 'generic1?': this.generic1,
      });
    },
    
    matchIconStyle: function() {
      return `color: ${this.matchScaleEntry.color};`;
    },
    
    matchLabel: function() {
      return this.matchScaleEntry.text;
    },
    
    matchScaleEntry: function() {
      for (let i = 0; i < matchScale.length; i++) {
        let entry = matchScale[i];
        if (this.match >= entry.from && this.match <= entry.to) {
          return entry;
        }
      }
      return {};
    },
    
    matchIcon: function() {
      return this.matchScaleEntry.icon;
    },
  },
  
  mounted: function() {
    if (this.generic1) {
      // load records with given name via release
      simplyLoad('artists/releasesById', {id: this.id}, [
        onAfterFilter((i) => i.Title.normalize() === this.generic1.normalize()),
        onAfterMap((i) => Object.assign({id: i.UniqueId}))]).
        then((payloads) => {
          simplyLoadAll('releases/recordsById', payloads, onAfterFilter(
            (i) => i.Title.normalize() === this.name.normalize())).
            then((data) => {
              this.processRecords(data);
            }).catch(console.error);
        }).catch(console.error);
    } else {
      // load direct
      simplyLoad('artists/recordsById', {id: this.id},
        onAfterFilter((i) => i.Title.normalize() === this.name.normalize())).
        then((data) => {
          this.processRecords(data);
        }).catch(console.error);
    }
  },
  
  methods: {
  
    processRecords: async function(records) {
      this.disambiguation = [
        ...new Set(records.map(r => r.Disambiguation))].join(', ');
      this.duration = `${secondsToReadableString(records.reduce(
        (a, b) => a + (b.Length / 1000), 0) / records.length)}min`;
      
      // load all tracks related to these records
      let payloads = records.map((i) => Object.assign({id: i.UniqueId}));
      let loadTracks = simplyLoadAll('records/tracksById', payloads).
        then((data) => {
          this.initPlayForBestGuess(data);
        });
      let loadAliases = simplyLoadAll('records/aliasesById', payloads).
        then((data) => {
          this.aliases = data.map(d => d.Name).join(', ');
        });
    
      await Promise.all([loadTracks, loadAliases]).catch(console.error);
    
      this.isLoading = false;
    },
    
    initPlayForBestGuess: function(data) {
      let result = getBestMatchingTrack(data);
      if (null == result) {
        this.track = {};
        this.match = 0;
      } else {
        this.track = result.track;
        this.match = result.match;
        if (!this.duration) {
          this.duration = secondsToReadableString(this.track.Duration);
        }
      }
    },
    
    play: function() {
      Store.dispatch('audio/play', {track: this.track, title: this.name}).
        catch(console.error);
    },
  
    addToPlaylist: function() {
      Store.dispatch('audio/addToPlaylist',
        {track: this.track, title: this.name}).
        catch(console.error);
    },
    
  },
});
