export default {
  namespaced: true,
  
  state: {
    hints: [],
  },
  
  getters: {
    hints: s => s.hints,
  },
  
  mutations: {
    hints: (s, payload) => s.hints = payload,
  },
  
  actions: {
    async hint({commit}, payload) {
      commit('hints', {
        message: payload.message || payload,
      });
    },
  },
};
