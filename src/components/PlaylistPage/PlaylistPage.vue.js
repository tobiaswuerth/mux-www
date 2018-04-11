import Sortable from 'sortablejs';
import Store from './../../ecosystems/vuex/Store';
import {secondsToReadableString} from './../../scripts/Utils';

export default {
  name: 'PlaylistPage',
  
  mounted: function() {
    let self = this;
    
    let list = document.getElementById('list');
    Sortable.create(list, {
      group: 'list',
      animation: 150, chosenClass: 'sortable-chosen', handle: '.draggable',
      onUpdate: function(e) {
        let tmp = self.items[e.oldIndex];
        self.items[e.oldIndex] = self.items[e.newIndex];
        self.items[e.newIndex] = tmp;
        Store.dispatch('audio/setPlaylist', self.items);
      },
    });
  },
  
  methods: {
    readableTime: function(seconds) {
      return secondsToReadableString(seconds);
    },
  
    clearList: function() {
      Store.dispatch('audio/setPlaylist', []).catch(console.error);
    },
  },
  
  computed: {
    items: function() {
      return Store.getters['audio/playlist'];
    },
  },
  
};
