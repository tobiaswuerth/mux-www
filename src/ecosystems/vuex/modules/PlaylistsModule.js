import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    async all({}, payload) {
      return await Store.dispatch('repo/playlists', payload);
    },
    
    async byId({}, payload) {
      return await Store.dispatch('repo/playlistById', payload);
    },
    
    async create({}, payload) {
      return await Store.dispatch('repo/playlistsCreate', payload);
    },
    
    async createEntry({}, payload) {
      return await Store.dispatch('repo/playlistsCreateEntry', payload);
    },
    
    async createPermission({}, payload) {
      return await Store.dispatch('repo/playlistsCreatePermission', payload);
    },
    
    async delete({}, payload) {
      return await Store.dispatch('repo/playlistsDelete', payload);
    },
    
    async deleteEntry({}, payload) {
      return await Store.dispatch('repo/playlistsDeleteEntry', payload);
    },
    
    async deletePermission({}, payload) {
      return await Store.dispatch('repo/playlistsDeletePermission', payload);
    },
  },
};
