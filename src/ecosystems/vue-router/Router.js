import Vue from 'vue';
import Router from 'vue-router';
import Store from '../vuex/Store';

import LoginPage from '../../components/LoginPage/LoginPage';
import AuthenticatedPage from '../../components/AuthenticatedPage/AuthenticatedPage';
import WelcomeScreen from '../../components/WelcomeScreen/WelcomeScreen';

import TracksContent from '../../components/TracksContent/TracksContent';

import RecordsContent from '../../components/RecordsContent/RecordsContent';

import ReleasesContent from '../../components/ReleasesContent/ReleasesContent';

import ArtistsList from '../../components/ArtistsList/ArtistsList';
import ArtistsByNameList from '../../components/ArtistsByNameList/ArtistsByNameList';

Vue.use(Router);

export const routes = {
  public: {
    login: '/login',
  },

  private: {
    root: '/', artists: '/a', releases: '/r', records: '/s', tracks: '/t',
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
        // main
        {
          path: routes.private.root,
          component: WelcomeScreen,
        },
        {
          path: routes.private.tracks,
          component: TracksContent,
        },
        {
          path: routes.private.artists,
          component: ArtistsList,
        },
        {
          path: routes.private.records,
          component: RecordsContent,
        },
        {
          path: routes.private.releases,
          component: ReleasesContent,
        },

        // detailed
        {
          path: `${routes.private.artists}/:name`,
          component: ArtistsByNameList,
          props: true,
        }],
    },
    {
      path: routes.public.login,
      component: LoginPage,
    }],
});
export default router;
