export default {
  namespaced: true,
  
  state: {
    hints: [], overlayData: {},
  },
  
  getters: {
    hints: s => s.hints, overlayData: s => s.overlayData,
  },
  
  mutations: {
    hints: (s, payload) => s.hints = payload,
    overlayData: (s, payload) => s.overlayData = payload,
  },
  
  actions: {
    async hint({commit}, payload) {
      commit('hints', {
        message: payload.message || payload,
      });
    },
  
    async displayOverlay({dispatch, getters, commit}, payload) {
      commit('overlayData', payload);
    },
  },
};
