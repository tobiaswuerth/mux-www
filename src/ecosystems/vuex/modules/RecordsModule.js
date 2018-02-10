import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    async all({commit, getters}, payload) {
      return await Store.dispatch('repo/records', payload);
    },
    
    async byName({commit, getters}, payload) {
      return await Store.dispatch('repo/recordsByName', payload);
    },
    
    async byId({commit, getters}, payload) {
      return await Store.dispatch('repo/recordById', payload);
    },
  },
};
