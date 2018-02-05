import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Store from './Store';

import LoginPage from './pages/LoginPage';
import AuthenticatedPage from './pages/AuthenticatedPage';

const routes = {
  public: {
    login: '/login',
  },

  private: {
    root: '/',
  },
};

const assertAuthenticated = (to, from, next) => {
  if (!Store.getters['auth/isAuthenticated']) {
    console.log('-> reroute unauthenticated request to public login');
    next(routes.public.login);
  } else {
    next();
  }
};

const router = new Router({
  mode: 'history',

  routes: [
    {
      path: routes.private.root,
      component: AuthenticatedPage,
      beforeEnter: assertAuthenticated,
    },
    {
      path: routes.public.login,
      component: LoginPage,
    }],
});

router.beforeEach((to, from, next) => {
  `registered routing request from '${from.fullPath}' to '${to.fullPath}'`;
  next();
});

export default router;
