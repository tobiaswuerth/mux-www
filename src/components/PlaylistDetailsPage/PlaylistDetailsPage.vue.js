import Router, {paths} from './../../ecosystems/vue-router/Router';
import {prepareRoute} from './../../ecosystems/vue-router/RouterUtils';
import {secondsToReadableString} from './../../scripts/Utils';
import Store from '../../ecosystems/vuex/Store';
import List from '../List/List';
import {types as overlayTypes} from './../Overlay/Overlay.vue';

export default {
  name: 'PlaylistDetailsPage',
  
  props: {
    id: {},
  },
  
  components: {
    List,
  },
  
  data: () => {
    let data = {
      item: null,
      isOwner: false,
      loadRoute: 'playlists/byId',
      payload: async (p) => p,
      playlistShowAvatar: false,
    };
    data.onAfter = (d) => {
      data.item = d.dataSource.data[0];
      data.component = d.loader.parent;
      data.instance = d.loader.parent.$parent;
      d.dataSource.data = data.item.Entries;
      Store.dispatch('auth/getClaims').then((c) => {
        data.isOwner = data.item.CreateUser.UniqueId === c.ClientId;
      }).catch(console.error);
    };
    data.listActions = [
      {
        icon: 'more_vert', isRaised: false, isRound: true,
      }];
    return data;
  },
  
  methods: {
    edit: function() {
      Router.push(prepareRoute(paths.private.playlists.edit, {id: this.id}));
    },
  
    entryToString1: (i) => i.Title,
  
    entryToString2: (i) => secondsToReadableString(i.Track.Duration),
  
    entryToString3: (i) => `Added by: ${i.CreateUser.Username}`,
  
    play: async function() {
      if (this.item.Entries.length > 0) {
        await Store.dispatch('audio/pause').catch(console.error);
        await Store.dispatch('audio/setPlaylist', []).
          catch(console.error);
        let entries = this.item.Entries.map(
          (e) => Object.assign({}, {track: e.Track, title: e.Title}));
        await Store.dispatch('audio/addToCurrentPlaylist', entries).
          catch(console.error);
        await Store.dispatch('audio/setPlaylistIndex', 0);
      } else {
        Store.dispatch('global/displayOverlay', {
          display: false,
        }).catch(console.error);
        Store.dispatch('global/hint',
          `Playlist '${this.item.Name}' does not contain any entries yet`).
          catch(console.error);
      }
    },
  
    onItemClicked: function(i) {
      let buttons = [
        {
          type: 'primary',
          text: 'Play now',
          icon: 'play_arrow',
          onClick: () => Store.dispatch('audio/play',
            {title: i.Title, track: i.Track}).catch(console.error),
        },
        {
          type: '',
          text: 'Add to currently playing list',
          icon: 'playlist_play',
          onClick: () => Store.dispatch('audio/addToCurrentPlaylist',
            {title: i.Title, track: i.Track}).catch(console.error),
        },
        {
          type: '',
          text: 'Add to a playlist',
          icon: 'playlist_add',
          onClick: () => Store.dispatch('audio/addToPlaylist',
            {title: i.Title, trackId: i.Track.UniqueId}).catch(console.error),
        }];
    
      if (this.isOwner) {
        buttons.push({
          type: 'accent',
          text: 'Remove from playlist',
          icon: 'delete',
          onClick: () => {
            let playlistId = this.id;
            let entryId = i.UniqueId;
            let self = this;
  
            Store.dispatch('global/displayOverlay', {
              type: overlayTypes.none,
              display: true,
              text: `Are you sure you want to remove '${i.Title}' from this playlist?`,
              buttons: [
                {
                  type: '',
                  text: 'No, do not delete',
                  icon: 'clear',
                  onClick: () => Store.dispatch('global/displayOverlay',
                    {display: false}).catch(console.error),
                },
                {
                  type: 'accent',
                  text: 'Yes, do delete playlist',
                  icon: 'delete',
                  onClick: async () => {
                    await Store.dispatch('global/displayOverlay', {
                      type: overlayTypes.spinner,
                      display: true,
                      text: 'Removing track from playlist...',
                    }).catch(console.error);
                    await Store.dispatch('playlists/deleteEntry',
                      {playlistId: playlistId, entryId: entryId}).then(() => {
                        let filtered = self.item.Entries.filter(
                          (i) => i.UniqueId !== entryId);
                        self.item.Entries.length = 0;
                        filtered.forEach((e) => self.item.Entries.push(e));
                      }).
                      catch((r) => {
                        console.error(r);
                        Store.dispatch('global/hint',
                          `Something went wrong: ${r}`).
                          catch(console.error);
                      });
  
                    Store.dispatch('global/displayOverlay', {display: false}).
                      catch(console.error);
                  },
                },],
            }).catch(console.error);
          },
        });
      }
    
      Store.dispatch('global/displayOverlay', {
        type: overlayTypes.none,
        display: true,
        text: 'Actions',
        closeable: true,
        buttons: buttons,
      }).catch(console.error);
    },
  },
};
