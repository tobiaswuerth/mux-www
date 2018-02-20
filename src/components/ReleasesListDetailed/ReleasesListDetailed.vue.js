import Router from './../../ecosystems/vue-router/Router';
import Routes from './../../ecosystems/vue-router/Routes';
import Repeater from '../Repeater/Repeater';

export default {
  name: 'ReleasesListDetailed',
  
  components: {
    Repeater,
  },
  
  data: () => {
    return {
      routes: Routes,
      
      repeater: {
        
        global: {
          payload: {},
          hideEmptyState: {},
          route: 'releases/byName',
          valueKey: 'UniqueId',
          doPreload: true,
        },
        
        artists: {
          route: 'releases/artistsById', valueKey: 'UniqueId',
        },
        
        aliases: {
          route: 'releases/aliasesById',
          valueKey: 'UniqueId',
          doPreload: true,
          hideEmptyState: true,
        },
      },
      
      data: [],
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
    }, getLimittedIdPayload: function(id, pageSize) {
      let payload = this.getIdPayload(id);
      payload.pageSize = pageSize || 5;
      return payload;
    }, getIdPayload: function(id) {
      return {
        id: id,
      };
    },
  },
  
  props: {
    name: {}, dataSource: {},
  },
};
