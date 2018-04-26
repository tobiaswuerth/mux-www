import Sortable from 'sortablejs';
import Store from './../../ecosystems/vuex/Store';
import {secondsToReadableString} from './../../scripts/Utils';

let i = 0;
const states = {
  normal: 1 << i++, edit: 1 << i++,
};

export default {
  name: 'PlaylistPage',
  
  mounted: function() {
    let self = this;
    
    let list = document.getElementById('list');
    Sortable.create(list, {
      group: 'list',
      animation: 150,
      chosenClass: 'sortable-chosen',
      handle: '.draggable',
      onUpdate: function(e) {
        let tmp = self.items[e.oldIndex];
        self.items[e.oldIndex] = self.items[e.newIndex];
        self.items[e.newIndex] = tmp;
        Store.dispatch('audio/setPlaylist', self.items).catch(console.error);
      },
    });
  },
  
  methods: {
    readableTime: function(seconds) {
      return secondsToReadableString(seconds);
    },
  
    selectAll: function() {
      let checkboxes = Array.from(document.getElementsByClassName('checkbox '));
      let unchecked = checkboxes.filter(
        x => !x.className.includes('md-checked'));
      if (unchecked.length === 0) {
        checkboxes.forEach(x => x.click());
      } else {
        unchecked.forEach(x => x.click());
      }
    },
    
    startEditMode: function() {
      this.state = states.edit;
    },
    
    stopEditMode: function() {
      this.state = states.normal;
      this.selectedItems = [];
    },
    
    deleteSelected: function() {
      let items = this.items;
      let indexes = this.selectedItems.sort((a, b) => a < b ? 1 : -1);
      indexes.forEach((i) => {
        items.splice(i, 1);
      });
      
      Store.dispatch('audio/setPlaylist', items).catch(console.error);
      this.selectedItems = [];
    },
    
    removeItem: function(i, event) {
      event.stopPropagation();
      
      let items = this.items;
      items.splice(i, 1);
      Store.dispatch('audio/setPlaylist', items).catch(console.error);
      this.selectedItems = [];
    },
    
    play: function(i, event) {
      event.stopPropagation();
      Store.dispatch('audio/setPlaylistIndex', i).catch(console.error);
    },
  },
  
  data: () => {
    return {
      state: states.normal, selectedItems: [],
    };
  },
  
  computed: {
    items: function() {
      return Store.getters['audio/playlist'];
    },
    
    isEditMode: function() {
      return this.state === states.edit;
    },
  },
  
};
