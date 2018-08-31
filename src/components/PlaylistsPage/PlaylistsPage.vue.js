import List from '../List/List';
import {types as overlayTypes} from '../Overlay/Overlay';
import Router, {paths} from './../../ecosystems/vue-router/Router';
import Store from './../../ecosystems/vuex/Store';
import {prepareRoute} from './../../ecosystems/vue-router/RouterUtils';
import {simplyLoad} from './../../scripts/DataLoaderUtils';

export default {
  name: 'PlaylistsPage',
  
  components: {
    List,
  },
  
  data: () => {
    return {
      loadRoute: 'playlists/all', playlistShowAvatar: true, listActions: [
        {
          icon: 'play_arrow', isRaised: true,
          isRound: true, onClick: async (i) => {
            Store.dispatch('global/displayOverlay', {
              type: overlayTypes.spinner,
              display: true,
              text: 'Collecting data...',
            }).catch(console.error);
            simplyLoad('playlists/byId', {id: i.UniqueId}).then(async (d) => {
              let playlist = d[0];
      
              if (playlist.Entries.length > 0) {
                await Store.dispatch('audio/pause').catch(console.error);
                await Store.dispatch('audio/setPlaylist', []).
                  catch(console.error);
                let entries = playlist.Entries.map(
                  (e) => Object.assign({}, {track: e.Track, title: e.Title}));
                await Store.dispatch('audio/addToCurrentPlaylist', entries).
                  catch(console.error);
                await Store.dispatch('audio/setPlaylistIndex', 0);
              } else {
                Store.dispatch('global/displayOverlay', {
                  display: false,
                }).catch(console.error);
                Store.dispatch('global/hint',
                  `Playlist '${playlist.Name}' does not contain any entries yet`).
                  catch(console.error);
              }
            }).catch((r) => {
              console.error(r);
              Store.dispatch('global/displayOverlay', {
                display: false,
              }).catch(console.error);
              Store.dispatch('global/hint', `Something went wrong: ${r}`).
                catch(console.error);
            });
          },
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
