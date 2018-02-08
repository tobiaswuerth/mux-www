import Store from '../Store';
import Router from '../../vue-router/Router';

export const watcher = {
  initialize: function() {
    Store.watch(function() {
      return Store.getters['auth/isAuthenticated'];
    }, function(newVal) {
      Store.dispatch('watch/isAuthenticated', newVal).then(v => {
        // ignore
      }).catch(v => {
        // ignore
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
  },
};
