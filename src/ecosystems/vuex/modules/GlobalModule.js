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
  
    async notify({dispatch}, payload) {
      if (!('Notification' in window) || Notification.permission === 'denied') {
        return Promise.resolve(false);
      }
    
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then((p) => {
          if (p === 'granted') {
            dispatch('notify', payload).catch(console.error);
          }
        }).catch(console.error);
      } else {
        let n = new Notification(payload.title, payload.options);
        setTimeout(() => {
          n.close();
        }, payload.timeout || 3000);
      }
    
    },
  },
};
