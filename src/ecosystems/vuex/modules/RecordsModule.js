import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    async all({}, payload) {
      return await Store.dispatch('repo/records', payload);
    },
    
    async byName({}, payload) {
      return await Store.dispatch('repo/recordsByName', payload);
    },
    
    async byId({}, payload) {
      return await Store.dispatch('repo/recordById', payload);
    },
  },
};
