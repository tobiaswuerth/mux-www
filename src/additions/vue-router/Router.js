import Vue from 'vue';
import Router from 'vue-router';
import Store from '../vuex/Store';

import LoginPage from '../../components/LoginPage/LoginPage';
import AuthenticatedPage from '../../components/AuthenticatedPage/AuthenticatedPage';
import WelcomeScreen from '../../components/WelcomeScreen/WelcomeScreen';
import TracksContent from '../../components/TracksContent/TracksContent';
import ArtistsContent from '../../components/ArtistsContent/ArtistsContent';
import RecordsContent from '../../components/RecordsContent/RecordsContent';
import ReleasesContent from '../../components/ReleasesContent/ReleasesContent';

Vue.use(Router);

export const routes = {
  public: {
    login: '/login',
  },

  private: {
    root: '/',
    artists: '/a',
    releases: '/r',
    records: '/s',
    tracks: '/t',
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
