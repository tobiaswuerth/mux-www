import ReleaseCard from './../ReleaseCard/ReleaseCard';
import DataLoaderWrapper from '../DataLoaderWrapper/DataLoaderWrapper';
import DataLoader from './../../scripts/DataLoader';
import Router, {paths} from './../../ecosystems/vue-router/Router';

export default {
  name: 'ReleasesListDetailed',
  
  components: {
    DataLoaderWrapper, ReleaseCard,
  },
  
  data: () => {
    return {
      dataLoader: new DataLoader('releases/byName', this),
    };
  },
  
  mounted: function() {
    this.dataLoader.onAfter = (dataLoader) => {
      if (dataLoader.dataSource.data.length === 1) {
        // auto select record
        let id = dataLoader.dataSource.data[0].UniqueId;
        Router.push(paths.private.releases.details.replace(':id',
          encodeURIComponent(id)));
      }
    };
    
    this.dataLoader.load({name: this.name}).then(() => {
      // ignore
    }).catch((r) => {
      console.error(r);
    });
  },
  
  props: {
    name: {},
  },
};
