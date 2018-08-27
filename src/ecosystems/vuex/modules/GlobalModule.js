export default {
  namespaced: true,
  
  state: {
    hints: [], loadingScreenData: {}, inputScreenData: {},
  },
  
  getters: {
    hints: s => s.hints,
    loadingScreenData: s => s.loadingScreenData,
    inputScreenData: s => s.inputScreenData,
  },
  
  mutations: {
    hints: (s, payload) => s.hints = payload,
    loadingScreenData: (s, payload) => s.loadingScreenData = payload,
    inputScreenData: (s, payload) => s.inputScreenData = payload,
  },
  
  actions: {
    async hint({commit}, payload) {
      commit('hints', {
        message: payload.message || payload,
      });
    },
  
    async displayLoadingScreen({getters, commit}, payload) {
      commit('loadingScreenData', payload);
    },
  
    async displayInputScreen({getters, commit}, payload) {
      commit('inputScreenData', payload);
    },
  },
};
