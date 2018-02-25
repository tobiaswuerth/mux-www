import ReleaseCard from './../ReleaseCard/ReleaseCard';
import DataLoaderWrapper from '../DataLoaderWrapper/DataLoaderWrapper';
import DataLoader, {onAfterFilter} from './../../scripts/DataLoader';

export default {
  name: 'ArtistReleaseVariationsList',
  
  components: {
    DataLoaderWrapper, ReleaseCard,
  },
  
  data: () => {
    return {
      dataLoader: new DataLoader('artists/releasesById', this),
    };
  },
  
  mounted: function() {
    this.dataLoader.onAfter = onAfterFilter(
      (i) => i.Title.normalize() === this.name.normalize());
    this.dataLoader.load({id: this.id}, true).then(() => {
      // ignore
    }).catch((r) => {
      console.error(r);
    });
  },
  
  props: {
    name: {}, id: {},
  },
};
