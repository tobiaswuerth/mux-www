import List from '../List/List';
import Routes from './../../ecosystems/vue-router/Routes';
import Router from './../../ecosystems/vue-router/Router';

const routerPushId = function(id) {
  Router.push(
    Routes.private.artists.details.replace(':id', encodeURIComponent(id)));
};

export default {
  name: 'ArtistsListDetailed',
  
  components: {
    List,
  },
  
  props: {
    name: {}, dataSource: {}, postProcessor: {},
  },
  
  data: () => {
    return {
      route: 'artists/byName',
      doPreload: true,
      valueKey: 'UniqueId',
      doInsetDivider: true,
      hideEmptyState: false,
    };
  },
  
  computed: {
    payload: function() {
      return {
        name: this.name,
      };
    },
  },
  
  methods: {
    onClick: function(value) {
      routerPushId(value[this.valueKey]);
    },
    
    onAfter: function(dataLoader) {
      if (dataLoader.dataSource.data.length === 1) {
        // auto select record
        let vk = dataLoader.dataSource.data[0][this.valueKey];
        routerPushId(vk);
      }
    },
  },
};

