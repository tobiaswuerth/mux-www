import List from '../List/List';
import {types as overlayTypes} from '../Overlay/Overlay.vue';
import {types} from '../Overlay/Overlay.vue.js';
import {simplyLoad} from '../../scripts/DataLoaderUtils';
import Store from '../../ecosystems/vuex/Store';
import {clone} from './../../scripts/DataUtils';
import Router, {paths} from './../../ecosystems/vue-router/Router';
import {prepareRoute} from './../../ecosystems/vue-router/RouterUtils';

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
        this.users = this.users.filter((u) => u.UniqueId !== c.ClientId);
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
      Store.dispatch('global/displayOverlay', {
          type: types.none,
          display: true,
          text: 'Are you sure you want to delete this playlist?',
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
              onClick: () => {
                Store.dispatch('global/displayOverlay', {display: false}).
                  catch(console.error);
                Store.dispatch('global/displayOverlay', {
                    display: true,
                    type: overlayTypes.spinner,
                    text: 'Deleting playlist...',
                  }).
                  catch(console.error);
                Store.dispatch('playlists/delete', {id: this.item.UniqueId}).
                  then(() => Router.push(paths.private.playlists.root)).
                  catch((e) => {
                    console.error(e);
                    Store.dispatch('global/hint',
                      `Something went wrong. Could not delete playlist. Error: ${e}`).
                      catch(console.error);
                  }).
                  finally(() => {
                    Store.dispatch('global/displayOverlay', {display: false}).
                      catch(console.error);
                  });
              },
            }],
        }).
        catch(console.error);
    },
    
    revoke: function(item) {
      let user = item.User;
      let userId = user.UniqueId;
  
      Store.dispatch('global/displayOverlay', {
          type: types.none,
          display: true,
          text: `Are you sure you want to revoke the permissions for the user '${user.Username}'`,
          buttons: [
            {
              type: '',
              text: 'No, do not revoke',
              icon: 'clear',
              onClick: () => Store.dispatch('global/displayOverlay',
                {display: false}).catch(console.error),
            },
            {
              type: 'accent',
              text: 'Yes, revoke permission',
              icon: 'delete',
              onClick: () => {
                this.item.Permissions = this.item.Permissions.filter(
                  p => p.User.UniqueId !== userId);
                this.users.push(user);
                this.modifies = this.modifies.filter(p => p !== userId);
                Store.dispatch('global/displayOverlay', {display: false}).
                  catch(console.error);
              },
            }],
        }).
        catch(console.error);
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
      Store.dispatch('global/displayOverlay', {
        display: true, types: overlayTypes.spinner, text: 'Saving playlist...',
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
      Store.dispatch('global/displayOverlay', {
        display: true, type: overlayTypes.spinner,
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
        Store.dispatch('global/hint', 'Successfully saved playlist').
          catch(console.error);
        Router.push(
          prepareRoute(paths.private.playlists.details, {id: playlistId}));
      }).catch(r => {
        Store.dispatch('global/hint',
          `Something went wrong while updating the permissions. Error: ${r}`).
          catch(console.error);
        console.error(r);
      }).finally(() => {
        Store.dispatch('global/displayOverlay', {
          display: false,
        }).catch(console.error);
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
