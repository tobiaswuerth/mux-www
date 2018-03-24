import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {paths} from './../../ecosystems/vue-router/Router';
import {prepareRoute} from './../../ecosystems/vue-router/RouterUtils';
import {onAfterSingle, simplyLoad} from './../../scripts/DataLoaderUtils';
import Store from './../../ecosystems/vuex/Store';
import {matchScale, secondsToReadableString} from './../../scripts/Utils';

export default Vue.extend({
  name: 'ArtistRecordDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  props: {
    id: {},
  },
  
  data: () => {
    return {
      track: null,
      match: 0,
      aliases: '',
      record: null,
      isLoading: true,
      duration: '',
    };
  },
  
  computed: {
    uriReleases: function() {
      return prepareRoute(paths.private.records.releases, {
        id: this.id,
      });
    }, uriArtists: function() {
      return prepareRoute(paths.private.records.artists, {
        id: this.id,
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
  
  mounted: async function() {
    let payload = {id: this.id};
  
    let loadRecord = simplyLoad('records/byId', payload, onAfterSingle).
      then((record) => {
        this.record = record;
        this.duration = secondsToReadableString(this.record.Length / 1000);
      });
  
    let loadTracks = simplyLoad('records/tracksById', payload).then((data) => {
      this.initPlayForBestGuess(data);
    });
  
    let loadAliases = simplyLoad('records/aliasesById', payload).
      then((data) => {
        this.aliases = data.map(d => d.Name).join(', ');
      });
  
    Promise.all([loadRecord, loadTracks, loadAliases]).catch((r) => {
      console.error(r);
    });
    
    this.isLoading = false;
  },
  
  methods: {
    initPlayForBestGuess: function(data) {
      // sum them up
      let scores = {};
      for (let d of data) {
        let score = d.Score;
        if (score === 1.0) {
          // perfect match
          this.track = d.Track;
          this.match = d.Score;
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
