import {paths} from './../../ecosystems/vue-router/Router';
import SubContentHub from './../SubContentHub/SubContentHub';

import DataLoader from './../../scripts/DataLoader';
import {onAfterSingle} from './../../scripts/DataLoaderUtils';

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
      dataLoader: new DataLoader('artists/byId', this),
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
    this.dataLoader.load({id: this.id}).catch(console.error);
  },
};
