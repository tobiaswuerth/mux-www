import Store from '../Store';

let i = 0;
const loginStates = {
  LOGIN_READY: 1 << i++, LOGIN_EXECUTING: 1 << i++,
};

export default {
  namespaced: true,
  
  state: {
    loginStates: loginStates, loginState: {
      state: loginStates.LOGIN_READY, lastResponse: null,
    }, isAuthenticated: false, data: null,
  },
  
  getters: {
    isAuthenticated: s => s.isAuthenticated,
    data: s => s.data,
    loginState: s => s.loginState,
    loginStates: s => s.loginStates,
    
    authHeader: s => {
      // validate
      if (!s.isAuthenticated) {
        return {};
      }
      
      let token = s.data.token;
      if (!token) {
        return {};
      }
      
      // build
      return {
        Authorization: `Bearer ${token}`,
      };
    },
    
    authDefaultOptions: (s, g) => {
      return {
        headers: g.authHeader,
      };
    },
  },
  
  mutations: {
    isAuthenticated: (s, payload) => s.isAuthenticated = payload,
    data: (s, payload) => s.data = payload,
    loginState: (s, payload) => s.loginState = payload,
  },
  
  actions: {
    async login({commit, dispatch, getters}, credentials) {
      // validate
      if (getters.loginState.state !== getters.loginStates.LOGIN_READY) {
        return Promise.reject('aborting. already running');
      }
      
      if (getters.isAuthenticated) {
        // nothing to do here
        commit('loginState', {state: loginStates.LOGIN_READY});
        return Promise.resolve();
      }
      
      if (!credentials) {
        return Promise.reject('credentials null');
      }
      
      if (!credentials.username || !credentials.password) {
        return Promise.reject('invalid credentials');
      }
      
      // execute
      commit('loginState', {state: loginStates.LOGIN_EXECUTING});
      
      await Store.dispatch('repo/login', credentials).then(v => {
        // successful login
        commit('data', v.data);
        commit('loginState', {
          state: loginStates.LOGIN_READY, lastResponse: v,
        });
        commit('isAuthenticated', true);
        return Promise.resolve();
      }).catch(v => {
        // login failed
        commit('data', null);
        commit('loginState', {
          state: loginStates.LOGIN_READY, lastResponse: v,
        });
        commit('isAuthenticated', false);
        return Promise.reject(v);
      });
    },
  },
};
