import Store from './../../ecosystems/vuex/Store';
import DataLoader from './../../scripts/DataLoader';
import {urlBase} from './../../ecosystems/vuex/modules/RepositoryModule';
import Clipboard from 'clipboard';

export default {
  name: 'InvitePage',
  
  data: () => {
    return {
      items: [],
    };
  },
  
  mounted: function() {
    this.load();
    
    let clipboard = new Clipboard('.copy-item');
    clipboard.on('success', function(e) {
      Store.dispatch('global/hint', 'Copied to clipboard').catch(console.error);
    });
  },
  
  methods: {
    normalizeDate: function(date) {
      return date.replace('T', ' / ').split('.')[0];
    },
    
    addNew: function() {
      Store.dispatch('invites/create').then(() => {
        this.load();
      }).catch(console.error);
    },
    
    getStyle: function(item) {
      if (item.IsExpired) {
        return 'item-expired';
      } else if (null != item.RegisteredUser) {
        return 'item-used';
      }
      return '';
    },
    
    getLink: function(item) {
      return `${urlBase}/register/${item.Token}`;
    },
    
    showActions: function(item) {
      return !this.getStyle(item);
    },
    
    load: function() {
      new DataLoader('invites/all', this).load().
        then((d) => {
          this.items = d;
        }).
        catch(console.error);
    },
    
    deleteSelected: function(id) {
      Store.dispatch('invites/delete', {id: id}).then(() => {
        this.load();
      }).catch(console.error);
    },
  },
};

