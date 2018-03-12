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
    
    async tracksById({}, payload) {
      return await Store.dispatch('repo/recordTracksById', payload);
    },
    
    async releasesById({}, payload) {
      return await Store.dispatch('repo/recordReleasesById', payload);
    },
    
    async artistsById({}, payload) {
      return await Store.dispatch('repo/recordArtistsById', payload);
    },
    
    async aliasesById({}, payload) {
      return await Store.dispatch('repo/recordAliasesById', payload);
    },
  },
};
