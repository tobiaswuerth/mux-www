import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    async all({}, payload) {
      return await Store.dispatch('repo/users', payload);
    },
  },
};
