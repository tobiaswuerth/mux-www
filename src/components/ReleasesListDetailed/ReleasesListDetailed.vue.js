import Router, {paths} from './../../ecosystems/vue-router/Router';
import DataLoaderWrapper from '../DataLoaderWrapper/DataLoaderWrapper';
import DataLoader from './../../scripts/DataLoader';

export default {
  name: 'ReleasesListDetailed',
  
  components: {
    DataLoaderWrapper,
  },
  
  data: () => {
    return {
      dataLoader: new DataLoader('releases/byName', this),
    };
  },
  
  mounted: function() {
    this.dataLoader.load({name: this.name}).then(() => {
      // ignore
    }).catch((r) => {
      console.error(r);
    });
  },
  
  methods: {
    doRoute: function(id) {
      let uri = paths.private.releases.details.replace(':id', id);
      Router.push(uri);
    },
    
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
  },
  
  props: {
    name: {},
  },
};
