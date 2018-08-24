import List from '../List/List';
import {simplyLoad} from '../../scripts/DataLoaderUtils';
import Store from '../../ecosystems/vuex/Store';
import {clone} from './../../scripts/DataUtils';
import Router, {paths} from './../../ecosystems/vue-router/Router';

export default {
  name: 'PlaylistEditPage',
  
  components: {
    List,
  },
  
  props: {
    id: {},
  },
  
  data: () => {
    return {
      dbItem: null,
      item: {},
      modifies: [],
      users: [],
      selectedUser: null,
      loading: true,
    };
  },
  
  mounted: function() {
    let loadings = [];
    
    if (this.isNew) {
      this.item = {
        Permissions: [], Name: '',
      };
    } else {
      let itemLoader = simplyLoad('playlists/byId', {id: this.id}).then(d => {
        this.dbItem = d[0];
        this.item = clone(this.dbItem);
      }).catch(console.error);
      loadings.push(itemLoader);
    }
    
    let userLoader = simplyLoad('users/all').then((d) => {
      this.users = d;
      // this is a workaround for an issue with the md-autocomplete
      // component when working with objects
      this.users.forEach((x) => x.toLowerCase = x.Username.toLowerCase);
      
      Store.dispatch('auth/getClaims').then((c) => {
        // exclude current user from displayed list (owner has always
        // permissions to modify playlist)
        this.users = this.users.filter((u) => u.Username !== c.Name);
      }).catch(console.error);
    }).catch(console.error);
    loadings.push(userLoader);
    
    Promise.all(loadings).
      then(() => {
        this.item.Permissions.filter((p) => p.CanModify).
          forEach((p) => this.modifies.push(p.User.UniqueId));
        this.loading = false;
      }).
      catch((r) => {
        Store.dispatch('global/hint',
          `Something went wrong. Could not load the page correctly. Try reloading the page. Error: ${r}`).
          catch(console.error);
        console.error(r);
      });
  },
  
  methods: {
    deletePlaylist: function() {
      console.log(this);
    },
    
    revoke: function(item) {
      let user = item.User;
      let userId = user.UniqueId;
      this.item.Permissions = this.item.Permissions.filter(
        p => p.User.UniqueId !== userId);
      this.users.push(user);
      this.modifies = this.modifies.filter(p => p !== userId);
    },
    
    userSelected: function() {
      let user = this.selectedUser;
      if (!user || !user.UniqueId) {
        // no proper user selected
        return;
      }
      
      this.item.Permissions.push({
        UniqueId: null, User: user, CanModify: false,
      });
      this.users = this.users.filter(u => u.UniqueId !== user.UniqueId);
      this.selectedUser = '';
    },
    
    savePlaylist: async function() {
      // validate
      let title = this.item.Name.trim();
      if (!title) {
        Store.dispatch('global/hint', 'Title for playlist cannot be empty').
          catch(console.error);
        return;
      }
      
      // update playlist
      Store.dispatch('global/displayLoadingScreen', {
        display: true, text: 'Saving playlist...',
      }).catch(console.error);
      
      if (this.isNew) {
        let response = await Store.dispatch('playlists/create', {name: title}).
          catch(console.error);
        this.dbItem = response.data;
      } else if (this.dbItem.Name !== title) {
        let response = await Store.dispatch('playlists/update',
          {name: title, id: this.dbItem.UniqueId}).catch(console.error);
        this.dbItem = response.data;
      }
      
      // update permissions
      Store.dispatch('global/displayLoadingScreen', {
        text: 'Saving permissions...',
      }).catch(console.error);
      
      let playlistId = this.dbItem.UniqueId;
      let existingIds = this.dbItem.Permissions.map((i) => i.User.UniqueId);
      let selectedIds = this.item.Permissions.map((i) => i.User.UniqueId);
      
      let toAddIds = selectedIds.filter((i) => existingIds.indexOf(i) === -1);
      let toDeleteIds = this.dbItem.Permissions.filter(
        (p) => selectedIds.indexOf(p.User.UniqueId) === -1).
        map((p) => p.UniqueId);
      let toUpdateIds = selectedIds.filter(
        (i) => existingIds.indexOf(i) !== -1).filter((i) => {
        let dbPerm = this.dbItem.Permissions.filter(
          (p) => p.User.UniqueId === i)[0];
        let perm = this.item.Permissions.filter(
          (p) => p.User.UniqueId === i)[0];
        return dbPerm.CanModify !== perm;
      });
      
      // execute updates
      let requests = [];
      toAddIds.concat(toUpdateIds).forEach((i) => {
        let canModify = this.modifies.indexOf(i) > -1;
        let request = Store.dispatch('playlists/createPermission', {
          userId: i, canModify: canModify, id: playlistId,
        }).catch(console.error);
        requests.push(request);
      });
      
      toDeleteIds.forEach((i) => {
        let request = Store.dispatch('playlists/deletePermission', {
          playlistId: playlistId, permissionId: i,
        }).catch(console.error);
        requests.push(request);
      });
      
      // wait for all updates to be executed
      Promise.all(requests).then(() => {
        // get fresh data from database
        simplyLoad('playlists/byId', {id: this.id}).then(d => {
          this.dbItem = d[0];
          this.item = clone(this.dbItem);
          
          // finalize
          Store.dispatch('global/displayLoadingScreen', {
            display: false,
          }).catch(console.error);
          Store.dispatch('global/hint', 'Successfully saved playlist').
            catch(console.error);
          if (this.isNew) {
            Router.push(
              paths.private.playlists.edit.replace(':id', playlistId));
          }
        }).catch(console.error);
      }).catch(r => {
        Store.dispatch('global/displayLoadingScreen', {
          display: false,
        }).catch(console.error);
        Store.dispatch('global/hint',
          `Something went wrong while updating the permissions. Error: ${r}`).
          catch(console.error);
        console.error(r);
      });
    },
  },
  
  computed: {
    titleSuffix: function() {
      let title = this.item.Name;
      return title ? `- "${title}"` : '';
    },
    
    isNew: function() {
      return 'new' === this.id;
    },
  },
};
