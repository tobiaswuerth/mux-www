import Store from '../Store';
import Router from '../../vue-router/Router';

export const watcher = {
  initialize: function() {
    // isAuthenticated
    Store.watch(function() {
      return Store.getters['auth/isAuthenticated'];
    }, function(newVal) {
      Store.dispatch('watch/isAuthenticated', newVal).then(() => {
        // ignore
      }).catch(v => {
        console.error(v);
      });
    });
  },
};

export default {
  namespaced: true,
  
  actions: {
    isAuthenticated: function({}) {
      Router.push('/');
      return Promise.resolve();
    },
    
    snackbarHint: function({}, payload) {
      Store.dispatch('snackbar/hint', payload).then(() => {
        // ignore
      }).catch(v => {
        console.error(v);
      });
    },
  },
};
