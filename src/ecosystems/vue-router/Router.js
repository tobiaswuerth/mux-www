import Vue from 'vue';
import Router from 'vue-router';
import Store from '../vuex/Store';

import LoginPage from '../../components/LoginPage/LoginPage';
import AuthenticatedPage from '../../components/AuthenticatedPage/AuthenticatedPage';
import WelcomeScreen from '../../components/WelcomeScreen/WelcomeScreen';

import TracksContent from '../../components/TracksContent/TracksContent';

import RecordsContent from '../../components/RecordsContent/RecordsContent';
import RecordsList from '../../components/RecordsList/RecordsList';

import ReleasesContent from '../../components/ReleasesContent/ReleasesContent';
import ReleasesList from './../../components/ReleasesList/ReleasesList';

import ArtistsList from '../../components/ArtistsList/ArtistsList';
import ArtistsByNameList from '../../components/ArtistsByNameList/ArtistsByNameList';
import ArtistDetailsPage from '../../components/ArtistDetailsPage/ArtistDetailsPage';

Vue.use(Router);

export const routes = {
  public: {
    login: '/login',
  },

  private: {
    root: '/',

    artists: {
      root: '/a',
      lookup: '/a/l/:name',
      details: '/a/:id',
      releases: '/a/:id/r',
      records: '/a/:id/s',
    },

    releases: '/r', records: '/s', tracks: '/t',
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
          path: routes.private.records,
          component: RecordsContent,
        },
        {
          path: routes.private.releases,
          component: ReleasesContent,
        },

        // artist
        {
          path: routes.private.artists.root,
          component: ArtistsList,
        },
        {
          path: routes.private.artists.lookup,
          component: ArtistsByNameList,
          props: true,
        },
        {
          path: routes.private.artists.details,
          component: ArtistDetailsPage,
          redirect: routes.private.artists.releases,
          props: true,
          children: [
            {
              path: routes.private.artists.releases, component: ReleasesList,
            }, {
              path: routes.private.artists.records, component: RecordsList,
            },],
        },],
    },
    {
      path: routes.public.login,
      component: LoginPage,
    }],
});
export default router;
