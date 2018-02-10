import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    async all({}, payload) {
      return await Store.dispatch('repo/releases', payload);
    },
    
    async byName({}, payload) {
      return await Store.dispatch('repo/releasesByName', payload);
    },
    
    async byId({}, payload) {
      return await Store.dispatch('repo/releaseById', payload);
    },
    
    async artistsById({}, payload) {
      return await Store.dispatch('repo/releaseArtistsById', payload);
    },
  
    async recordsById({}, payload) {
      return await Store.dispatch('repo/releaseRecordsById', payload);
    },
  },
};
