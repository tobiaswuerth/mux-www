import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {paths} from './../../ecosystems/vue-router/Router';
import {prepareRoute} from './../../ecosystems/vue-router/RouterUtils';
import {
  onAfterFilter, onAfterMap, simplyLoad, simplyLoadAll,
} from './../../scripts/DataLoaderUtils';
import Store from './../../ecosystems/vuex/Store';

const matchScale = {
  1: {
    icon: 'filter_1', text: 'horrible',
  }, 2: {
    icon: 'filter_2', text: 'horrible',
  }, 3: {
    icon: 'filter_3', text: 'horrible',
  }, 4: {
    icon: 'filter_4', text: 'very bad',
  }, 5: {
    icon: 'filter_5', text: 'bad',
  }, 6: {
    icon: 'filter_6', text: 'ok',
  }, 7: {
    icon: 'filter_7', text: 'good',
  }, 8: {
    icon: 'filter_8', text: 'very good',
  }, 9: {
    icon: 'filter_9_plus', text: 'excellent',
  },
};

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
      track: null, match: 0,
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
      if (this.match >= 100.0) {
        this.match = 99.0;
      }
    
      let r;
      let g;
    
      if (this.match < 50.0) {
        r = Math.floor(255 * (this.match / 50));
        g = 255;
      } else {
        r = 255;
        g = Math.floor(255 * ((50 - this.match % 50) / 50));
      }
    
      return `color: rgb(${r},${g},0); float: right;`;
    },
  
    matchLabel: function() {
      return this.matchScaleEntry.text;
    },
  
    matchScaleEntry: function() {
      let category = Math.round(this.match * 10);
      category = category < 1 ? 1 : category > 9 ? 9 : category;
      return matchScale[category];
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
          simplyLoadAll('releases/recordsById', payloads, [
            onAfterFilter((i) => i.Title.normalize() === this.name.normalize()),
            onAfterMap((i) => Object.assign({id: i.UniqueId}))]).
            then((payloads) => {
              this.processRecordIds(payloads);
            }).
            catch((r) => {
              console.error(r);
            });
        }).catch((r) => {
        console.error(r);
      });
    } else {
      // load direct
      simplyLoad('artists/recordsById', {id: this.id}, [
        onAfterFilter((i) => i.Title.normalize() === this.name.normalize()),
        onAfterMap((i) => Object.assign({id: i.UniqueId}))]).
        then((payloads) => {
          this.processRecordIds(payloads);
        }).catch((r) => {
        console.error(r);
      });
    }
  },
  
  methods: {
  
    processRecordIds: function(payloads) {
      // load all tracks related to these records
      simplyLoadAll('records/tracksById', payloads).then((data) => {
        this.initPlayForBestGuess(data);
      }).catch((r) => {
        console.error(r);
      });
      simplyLoadAll('records/aliasesById', payloads).then((data) => {
        console.log(data);
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
