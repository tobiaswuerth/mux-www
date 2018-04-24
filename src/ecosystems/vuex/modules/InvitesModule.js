import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    async all({}, payload) {
      return await Store.dispatch('repo/invites', payload);
    },
    
    async create({}, payload) {
      return await Store.dispatch('repo/invitesCreate', payload);
    },
    
    async delete({}, payload) {
      return await Store.dispatch('repo/invitesDelete', payload);
    },
    
    async use({}, payload) {
      return await Store.dispatch('repo/invitesUse', payload);
    },
  },
};
