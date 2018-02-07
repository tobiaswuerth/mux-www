import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Store from './Store';

import LoginPage from './pages/LoginPage';
import AuthenticatedPage from './pages/AuthenticatedPage';
import WelcomeScreen from './components/WelcomeScreen';
import TracksContent from './components/TracksContent';
import ArtistsContent from './components/ArtistsContent';
import RecordsContent from './components/RecordsContent';
import ReleasesContent from './components/ReleasesContent';

export const routes = {
  public: {
    login: '/login',
  },

  private: {
    root: '/',
    welcome: '/welcome',
    artists: '/artists',
    releases: '/releases',
    records: '/records',
    tracks: '/tracks',
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
      children: [
        {
          path: routes.private.root,
          component: WelcomeScreen,
          beforeEnter: assertAuthenticated,
        },
        {
          path: routes.private.tracks,
          component: TracksContent,
          beforeEnter: assertAuthenticated,
        },
        {
          path: routes.private.artists,
          component: ArtistsContent,
          beforeEnter: assertAuthenticated,
        },
        {
          path: routes.private.records,
          component: RecordsContent,
          beforeEnter: assertAuthenticated,
        },
        {
          path: routes.private.releases,
          component: ReleasesContent,
          beforeEnter: assertAuthenticated,
        },],
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
