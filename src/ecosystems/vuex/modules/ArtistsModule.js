import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    async all({commit, getters}, payload) {
      return await Store.dispatch('repo/artists', payload);
    },
    
    async byName({commit, getters}, payload) {
      return await Store.dispatch('repo/artistsByName', payload);
    },
    
    async byId({commit, getters}, payload) {
      return await Store.dispatch('repo/artistById', payload);
    },
    
    async releasesById({commit, getters}, payload) {
      return await Store.dispatch('repo/artistReleasesById', payload);
    },
    
    async recordsById({commit, getters}, payload) {
      return await Store.dispatch('repo/artistRecordsById', payload);
    },
  },
};
