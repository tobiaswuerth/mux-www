import Router, {paths} from './../../ecosystems/vue-router/Router';
import DataLoader from './../../scripts/DataLoader';
import DataLoaderWrapper from '../DataLoaderWrapper/DataLoaderWrapper';

export default {
  name: 'ReleaseCard',
  
  props: {
    item: {},
  },
  
  components: {
    DataLoaderWrapper,
  },
  
  methods: {
    
    doRouteArtist: function(id) {
      let uri = paths.private.artists.details.replace(':id', id);
      Router.push(uri);
    },
    
    getAliasLoader: async function(item) {
      let loader = new DataLoader('releases/aliasesById', this);
      await loader.load({id: item.UniqueId, pageSize: 5});
      return loader;
    },
    
    getArtistLoader: async function(item) {
      let loader = new DataLoader('releases/artistsById', this);
      await loader.load({id: item.UniqueId, pageSize: 5});
      return loader;
    },
    
    doRoute: function(id) {
      let uri = paths.private.releases.details.replace(':id', id);
      Router.push(uri);
    },
  },
};
