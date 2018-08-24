export default {
  namespaced: true,
  
  state: {
    hints: [], loadingScreenData: {},
  },
  
  getters: {
    hints: s => s.hints, loadingScreenData: s => s.loadingScreenData,
  },
  
  mutations: {
    hints: (s, payload) => s.hints = payload,
    loadingScreenData: (s, payload) => s.loadingScreenData = payload,
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
  },
};
