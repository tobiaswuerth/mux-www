import Vue from 'vue';
import Router from 'vue-router';
import Store from '../vuex/Store';

import LoginPage from '../../components/LoginPage/LoginPage.vue';
import AuthenticatedPage from '../../components/AuthenticatedPage/AuthenticatedPage.vue';
import WelcomeScreen from '../../components/WelcomeScreen/WelcomeScreen.vue';
import TracksContent from '../../components/TracksContent/TracksContent';
import ArtistsContent from '../../components/ArtistsContent/ArtistsContent.vue';
import RecordsContent from '../../components/RecordsContent/RecordsContent';
import ReleasesContent from '../../components/ReleasesContent/ReleasesContent';
import ArtistsByName from '../../components/ArtistsByName/ArtistsByName';

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
          path: routes.private.root, component: WelcomeScreen,
        }, {
          path: routes.private.tracks, component: TracksContent,
        }, {
          path: routes.private.artists, component: ArtistsContent,
        }, {
          path: routes.private.records, component: RecordsContent,
        }, {
          path: routes.private.releases, component: ReleasesContent,
        },

        // detailed
        {
          path: `${routes.private.artists}/:name`, component: ArtistsByName, props: true
        }
      ],
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
