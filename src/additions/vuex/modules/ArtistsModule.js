import Store from '../Store';

export default {
  namespaced: true,

  state: {
    cache: [],
  },

  getters: {
    cache: s => s.cache,
  },

  mutations: {
    cache: (s, payload) => s.cache = s.cache.concat(payload),
  },

  actions: {
    async all({dispatch, commit}, payload) {
      await Store.dispatch('repo/artists', payload).then(v => {
        commit('cache', v.data);
      }).catch(v => {
        console.error(v);
      });
    },
  },
};
