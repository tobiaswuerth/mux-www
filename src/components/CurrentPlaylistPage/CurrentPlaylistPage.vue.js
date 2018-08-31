import Store from './../../ecosystems/vuex/Store';
import {secondsToReadableString} from './../../scripts/Utils';
import List from './../List/List';

export default {
  name: 'CurrentPlaylistPage',
  
  components: {
    List,
  },
  
  data: () => {
    return {
      actionsRight: [
        {
          icon: 'playlist_add',
          type: '',
          text: 'Add to a playlist',
          onClick: (i) => Store.dispatch('audio/addToPlaylist',
            {trackId: i.track.UniqueId, title: i.title}).
            catch(console.error),
          isRaised: false,
          isRound: true,
        },
        {
          icon: 'play_arrow',
          type: 'primary',
          text: 'Play track',
          onClick: (i) => {
            let playlist = Store.getters['audio/playlist'];
            let idx = playlist.map((e) => e.key).indexOf(i.key);
            return Store.dispatch('audio/setPlaylistIndex', idx).
              catch(console.error);
          },
          isRaised: false,
          isRound: true,
          alwaysVisible: true,
        },
        {
          icon: 'clear',
          type: 'accent',
          text: 'Remove from list',
          onClick: async (i) => {
            let playlist = Store.getters['audio/playlist'];
            let idx = playlist.map((e) => e.key).indexOf(i.key);
            playlist.splice(idx, 1);
            await Store.dispatch('audio/pause', playlist).catch(console.error);
            await Store.dispatch('audio/setPlaylist', playlist).
              catch(console.error);
            await Store.dispatch('audio/setPlaylistIndex', idx).
              catch(console.error);
          },
          isRaised: false,
          isRound: true,
        },],
    };
  },
  
  methods: {
    removeItem: function(i, event) {
      event.stopPropagation();
      
      let items = this.items;
      items.splice(i, 1);
      Store.dispatch('audio/setPlaylist', items).catch(console.error);
    },
    
    play: function(i, event) {
      event.stopPropagation();
      Store.dispatch('audio/setPlaylistIndex', i).catch(console.error);
    },
  
    toString1: (i) => i.title,
    toString3: (i) => secondsToReadableString(i.track.Duration),
  },
  
  computed: {
    items: function() {
      return Store.getters['audio/playlist'];
    },
  },
  
};
