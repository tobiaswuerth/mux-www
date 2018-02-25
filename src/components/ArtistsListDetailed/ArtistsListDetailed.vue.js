import List from '../List/List';
import Router, {paths} from './../../ecosystems/vue-router/Router';

const routerPushId = function(id) {
  Router.push(
    paths.private.artists.details.replace(':id', encodeURIComponent(id)));
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

