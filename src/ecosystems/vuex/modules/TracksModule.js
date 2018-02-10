import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    async all({commit, getters}, payload) {
      return await Store.dispatch('repo/tracks', payload);
    },
    
    async byId({commit, getters}, payload) {
      return await Store.dispatch('repo/trackById', payload);
    },
  },
};
