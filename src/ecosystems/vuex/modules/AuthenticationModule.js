import Cookies from 'js-cookie';
import Store from '../Store';

export default {
  namespaced: true,
  
  actions: {
    getToken: function() {
      return Cookies.get('auth-token');
    },
    
    getAuthenticationHeaders: async function({getters, dispatch}) {
      // validate
      let token = await dispatch('getToken').catch(console.error);
      if (!token) {
        return Promise.resolve({});
      }
      
      // build
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    },
    
    isAuthenticated: async function({dispatch}) {
      return !!await dispatch('getToken').catch(console.error);
    },
    
    updateAuthentication: function({}, token) {
      Cookies.set('auth-token', token, {
        secure: location.protocol === 'https:', expires: 14,
      });
    },
  },
};

setInterval(async () => {
  if (await Store.dispatch('auth/isAuthenticated').catch(console.error)) {
    // refresh login
    await Store.dispatch('repo/loginRefresh').catch(console.error);
  }
}, 1000 * 60 * 60);
