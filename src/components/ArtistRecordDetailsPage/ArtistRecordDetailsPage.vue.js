import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {paths} from './../../ecosystems/vue-router/Router';
import {prepareRoute} from './../../ecosystems/vue-router/RouterUtils';
import {
  onAfterFilter, onAfterMap, simplyLoad, simplyLoadAll,
} from './../../scripts/DataLoaderUtils';
import Store from './../../ecosystems/vuex/Store';
import {matchScale, secondsToReadableString} from './../../scripts/Utils';

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
      track: null, match: 0, aliases: '', disambiguation: '', duration: '',
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
            }).
            catch((r) => {
              console.error(r);
            });
        }).catch((r) => {
        console.error(r);
      });
    } else {
      // load direct
      simplyLoad('artists/recordsById', {id: this.id},
        onAfterFilter((i) => i.Title.normalize() === this.name.normalize())).
        then((data) => {
          this.processRecords(data);
        }).catch((r) => {
        console.error(r);
      });
    }
  },
  
  methods: {
    
    processRecords: function(records) {
      this.disambiguation = [
        ...new Set(records.map(r => r.Disambiguation))].join(', ');
      this.duration = `${secondsToReadableString(records.reduce(
        (a, b) => a + (b.Length / 1000), 0) / records.length)}min`;
      
      // load all tracks related to these records
      let payloads = records.map((i) => Object.assign({id: i.UniqueId}));
      simplyLoadAll('records/tracksById', payloads).then((data) => {
        this.initPlayForBestGuess(data);
      }).catch((r) => {
        console.error(r);
      });
      simplyLoadAll('records/aliasesById', payloads).then((data) => {
        this.aliases = data.map(d => d.Name).join(', ');
      }).catch((r) => {
        console.error(r);
      });
    },
    
    initPlayForBestGuess: function(data) {
      // sum them up
      let scores = {};
      for (let d of data) {
        let score = d.Score;
        if (score === 1.0) {
          // perfect match
          this.track = d;
          this.match = 1.0;
          return;
        }
        
        let track = d.Track;
        let id = track.UniqueId;
        
        let entry = scores[id];
        if (null == entry) {
          scores[id] = {
            count: 1, sum: score, object: d,
          };
          continue;
        }
        
        entry.count++;
        entry.sum += score;
      }
      
      if (scores.length === 0) {
        this.track = {};
        return;
      }
      
      // calculate mean for each
      let means = Object.keys(scores).map(id => {
        let calcObj = scores[id];
        return {
          id: id, mean: (calcObj.sum / calcObj.count).toFixed(6),
        };
      });
      
      let bestGuess = means.sort((a, b) => a.mean < b.mean ? 1 : -1)[0];
      
      let entry = scores[bestGuess.id];
      this.track = entry.object.Track;
      this.match = bestGuess.mean;
    },
    
    play: function() {
      Store.dispatch('audio/play', {track: this.track}).catch((r) => {
        console.error(r);
      });
    },
    
  },
});
