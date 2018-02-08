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
    cache: (s, payload) => {
      let pageIndex = payload.pageIndex;
      if (null == pageIndex) {
        console.error('validation failed. payload does not contain page index');
        return;
      }

      s.cache[pageIndex] = payload.data;
    },
  },

  actions: {
    async all({commit, getters}, payload) {
      let pageIndex = payload.pageIndex || 0;

      let data = getters.cache[pageIndex];
      if (data) {
        return Promise.resolve(data);
      }

      await Store.dispatch('repo/artists', payload).then(v => {
        let data = {
          pageIndex: pageIndex, data: v.data,
        };
        commit('cache', data);
        return Promise.resolve(data);
      }).catch(v => {
        return Promise.reject(v);
      });
    },
  },
};
