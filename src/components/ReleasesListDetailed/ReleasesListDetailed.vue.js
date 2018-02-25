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
      dataLoader: new DataLoader('releases/byName', this), loaderCache: {},
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
    
    getAliasLoader: function(item) {
      let loader = new DataLoader('releases/aliasesById', this);
      /*loader.load({id: item.UniqueId}, true).then(() => {
       // ignore
       }).catch((r) => {
       console.error(r);
       });*/
      return loader;
    },
    
    getArtistLoader: function(item) {
      if (this.loaderCache[item.UniqueId]) {
        return this.loaderCache[item.UniqueId];
      }
      let loader = new DataLoader('releases/artistsById', this);
      this.loaderCache[item.UniqueId] = loader;
      loader.load({id: item.UniqueId, pageSize: 5}).then(() => {
        // ignore
      }).catch((r) => {
        console.error(r);
      });
      return loader;
    },
  },
  
  props: {
    name: {},
  },
};
