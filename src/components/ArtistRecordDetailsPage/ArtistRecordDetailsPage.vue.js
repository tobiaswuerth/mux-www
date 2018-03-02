import Vue from 'vue';
import DataLoader from '../../scripts/DataLoader';
import SubContentHub from './../SubContentHub/SubContentHub';
import {paths} from './../../ecosystems/vue-router/Router';
import {simplyLoad} from './../../scripts/DataLoaderUtils';
import Store from './../../ecosystems/vuex/Store';

export default Vue.extend({
  name: 'ArtistRecordDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  props: {
    id: {}, name: {},
  },
  
  data: () => {
    return {
      track: null,
    };
  },
  
  computed: {
    uriReleases: function() {
      return this.prepRoute(paths.private.artists.recordsLookup.releases);
    }, uriArtists: function() {
      return this.prepRoute(paths.private.artists.recordsLookup.artists);
    },
  },
  
  mounted: function() {
    // load all records of artists with given name
    simplyLoad('artists/recordsById', {id: this.id},
      (i) => i.Title.normalize() === this.name.normalize(),
      (i) => Object.assign({id: i.UniqueId})).then((payloads) => {
      
      // then load all tracks related to these records
      let loader = new DataLoader('records/tracksById');
      loader.loadAll(payloads, {doPreload: true}).
        then((data) => {
          this.initPlayForBestGuess(data);
        }).
        catch((r) => {
          console.error(r);
        });
    }).catch((r) => {
      console.error(r);
    });
  },
  
  methods: {
    
    initPlayForBestGuess: function(data) {
      // sum them up
      let scores = {};
      for (let d of data) {
        let score = d.Score;
        if (score === 1.0) {
          // perfect match
          this.track = d;
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
      this.track = scores[bestGuess.id].object.Track;
    },
    
    prepRoute: function(route) {
      return route.replace(':id', this.id).
        replace(':name', encodeURIComponent(this.name));
    },
    
    play: function() {
      Store.dispatch('audio/play', {track: this.track}).catch((r) => {
        console.error(r);
      });
    },
    
  },
});
