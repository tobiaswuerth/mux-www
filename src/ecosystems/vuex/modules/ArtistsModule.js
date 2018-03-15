import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    async all({}, payload) {
      return await Store.dispatch('repo/artists', payload);
    },
    
    async byName({}, payload) {
      return await Store.dispatch('repo/artistsByName', payload);
    },
    
    async byId({}, payload) {
      return await Store.dispatch('repo/artistById', payload);
    },
    
    async releasesById({}, payload) {
      return await Store.dispatch('repo/artistReleasesById', payload);
    },
    
    async recordsById({}, payload) {
      return await Store.dispatch('repo/artistRecordsById', payload);
    },
  
    async likeName({}, payload) {
      return await Store.dispatch('repo/artistsLikeName', payload);
    },
  },
};
