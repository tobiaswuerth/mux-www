import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    async all({commit, getters}, payload) {
      return await Store.dispatch('repo/releases', payload);
    },
    
    async byName({commit, getters}, payload) {
      return await Store.dispatch('repo/releasesByName', payload);
    },
    
    async byId({commit, getters}, payload) {
      return await Store.dispatch('repo/releaseById', payload);
    },
    
    async artistsById({commit, getters}, payload) {
      return await Store.dispatch('repo/releaseArtistsById', payload);
    },
  },
};
