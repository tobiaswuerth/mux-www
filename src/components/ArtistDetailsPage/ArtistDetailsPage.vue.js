import {paths} from './../../ecosystems/vue-router/Router';
import SubContentHub from './../SubContentHub/SubContentHub';

import DataLoader, {onAfterSingle} from './../../scripts/DataLoader';

export default {
  name: 'ArtistDetailsPage',
  
  components: {
    SubContentHub,
  },
  
  props: {
    id: {},
  },
  
  data: () => {
    return {
      dataLoader: new DataLoader('artists/byId'),
    };
  },
  
  computed: {
    getReleasesById: function() {
      return paths.private.artists.releases.replace(':id', this.id);
    },
    
    getRecordsById: function() {
      return paths.private.artists.records.replace(':id', this.id);
    },
  },
  
  mounted: function() {
    this.dataLoader.onAfter = onAfterSingle;
    this.dataLoader.load({id: this.id}).then(() => {
      // ignore
    }).catch((r) => {
      console.error(r);
    });
  },
};
