import Routes from './../../ecosystems/vue-router/Routes';
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
      return Routes.private.artists.releases.replace(':id', this.id);
    },
    
    getRecordsById: function() {
      return Routes.private.artists.records.replace(':id', this.id);
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
