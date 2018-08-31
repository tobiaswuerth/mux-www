import List from '../List/List';
import Router, {paths} from './../../ecosystems/vue-router/Router';
import {prepareRoute} from './../../ecosystems/vue-router/RouterUtils';

export default {
  name: 'PlaylistsPage',
  
  components: {
    List,
  },
  
  data: () => {
    return {
      loadRoute: 'playlists/all', playlistShowAvatar: true, listActions: [
        {
          icon: 'play_arrow',
          isRaised: false,
          isRound: true,
          onClick: (i) => alert('todo'),
        },
        {
          icon: 'keyboard_arrow_right',
          isRaised: false,
          isRound: true,
          onClick: (i) => this.a.methods.onEntryClick(i),
        }],
    };
  },
  
  methods: {
    
    add: function() {
      Router.push(prepareRoute(paths.private.playlists.edit, {id: 'new'}));
    },
    
    entryToString1: (i) => i.Name,
  
    entryToString3: (i) => `Created by: ${i.CreateUser.Username}`,
    
    onEntryClick: function(item) {
      Router.push(
        prepareRoute(paths.private.playlists.details, {id: item.UniqueId}));
    },
  },
};
