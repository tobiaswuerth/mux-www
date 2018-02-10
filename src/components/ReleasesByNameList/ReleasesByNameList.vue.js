import Router, {routes} from './../../ecosystems/vue-router/Router';
import Repeater from './../DataRepeater/DataRepeater';

export default {
  name: 'ReleasesByNameList',
  
  components: {
    Repeater,
  },
  
  data: () => {
    return {
      routes, repeater: {
        global: {
          route: 'releases/byName', valueKey: 'UniqueId', doPreload: true,
        }, artists: {
          route: 'releases/artistsById', valueKey: 'UniqueId',
        }, aliases: {
          route: 'releases/aliasesById',
          valueKey: 'UniqueId',
          doPreload: true,
          hideEmptyState: true,
        },
      }, data: [],
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
    doRoute: function(id) {
      let uri = this.routes.private.releases.details.replace(':id', id);
      Router.push(uri);
    }, doRouteArtist: function(id) {
      let uri = this.routes.private.artists.details.replace(':id', id);
      Router.push(uri);
    }, getLimittedIdPayload: function(releaseId) {
      return {
        id: releaseId, pageSize: 5,
      };
    },
  },
  
  props: {
    name: {}, dataSource: {},
  },
};
