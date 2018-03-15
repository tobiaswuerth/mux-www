export default {
  namespaced: true,
  
  state: {
    hints: [], searchQuery: '',
  },
  
  getters: {
    hints: s => s.hints, searchQuery: s => s.searchQuery,
  },
  
  mutations: {
    hints: (s, payload) => s.hints = payload,
    searchQuery: (s, payload) => s.searchQuery = payload,
  },
  
  actions: {
    async hint({commit}, payload) {
      commit('hints', {
        message: payload.message || payload,
      });
    },
  },
};
