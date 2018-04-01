import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';
import {paths} from './../../ecosystems/vue-router/Router';
import {prepareRoute} from './../../ecosystems/vue-router/RouterUtils';
import {onAfterSingle, simplyLoad} from './../../scripts/DataLoaderUtils';
import Store from './../../ecosystems/vuex/Store';
import {matchScale, secondsToReadableString} from './../../scripts/Utils';
import {getBestMatchingTrack} from './../../scripts/DataUtils';

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
    },
  
    uriArtists: function() {
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
        if (!!this.record.Length) {
          this.duration = secondsToReadableString(this.record.Length / 1000);
        }
      });
  
    let loadTracks = simplyLoad('records/tracksById', payload).then((data) => {
      this.initPlayForBestGuess(data);
    });
  
    let loadAliases = simplyLoad('records/aliasesById', payload).
      then((data) => {
        this.aliases = data.map(d => d.Name).join(', ');
      });
  
    await Promise.all([loadRecord, loadTracks, loadAliases]).
      catch(console.error);
    
    this.isLoading = false;
  },
  
  methods: {
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
      Store.dispatch('audio/play',
        {track: this.track, title: this.record.Title}).catch(console.error);
    },
  
    addToPlaylist: function() {
      Store.dispatch('audio/addToPlaylist',
        {track: this.track, title: this.record.Title}).
        catch(console.error);
    },
    
  },
});
