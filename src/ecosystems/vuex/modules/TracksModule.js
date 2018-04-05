import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    async all({}, payload) {
      return await Store.dispatch('repo/tracks', payload);
    },
    
    async byId({}, payload) {
      return await Store.dispatch('repo/trackById', payload);
    },
  
    async likeName({}, payload) {
      return await Store.dispatch('repo/tracksLikeName', payload);
    },
  },
};
