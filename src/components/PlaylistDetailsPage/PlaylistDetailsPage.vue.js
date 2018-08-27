import Router, {paths} from './../../ecosystems/vue-router/Router';
import {prepareRoute} from './../../ecosystems/vue-router/RouterUtils';

export default {
  name: 'PlaylistDetailsPage',
  
  props: {
    id: {},
  },
  
  methods: {
    edit: function() {
      Router.push(prepareRoute(paths.private.playlists.edit, {id: this.id}));
    },
  },
};
