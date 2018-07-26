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
          Authorization: `Bearer ${token}`, 'Content-Type': 'application/json',
        },
      };
    },
    
    isAuthenticated: async function({dispatch}) {
      return !!await dispatch('getToken').catch(console.error);
    },
  
    getClaims: async function({dispatch}) {
      let token = await dispatch('getToken').catch(console.error);
    
      if (!token) {
        return {};
      }
    
      let parts = token.split('.');
      if (parts.length < 3) {
        return {};
      }
    
      let sJsonClaims = atob(parts[1]);
      return JSON.parse(sJsonClaims);
    },
    
    updateAuthentication: function({}, token) {
      if (token) {
        Cookies.set('auth-token', token, {
          secure: location.protocol === 'https:', expires: 14,
        });
      } else {
        Cookies.remove('auth-token');
      }
    },
  },
};

setInterval(async () => {
  await Store.dispatch('repo/loginRefresh').catch(console.error);
}, 1000 * 60 * 10);
