export default {
  namespaced: true,
  
  state: {
    data: [],
  },
  
  getters: {
    data: s => s.data,
  },
  
  mutations: {
    data: (s, payload) => s.data = payload,
  },
  
  actions: {
    async hint({commit}, payload) {
      commit('data', {
        message: payload.message || payload,
      });
    },
  },
};
