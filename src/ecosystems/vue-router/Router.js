import Vue from 'vue';
import Router from 'vue-router';

import {assertAuthenticated, assertNotAuthenticated,} from './RouterUtils';

import ArtistsRoutes, {paths as artistsPaths} from './routes/ArtistsRoutes';
import TracksRoutes, {paths as tracksPaths} from './routes/TracksRoutes';
import RecordsRoutes, {paths as recordsPaths} from './routes/RecordsRoutes';
import ReleasesRoutes, {paths as releasePaths} from './routes/ReleasesRoutes';

Vue.use(Router);

const LoginPage = () => import('../../components/LoginPage/LoginPage');
const AuthenticatedPage = () => import('../../components/AuthenticatedPage/AuthenticatedPage');
const WelcomeScreen = () => import('../../components/WelcomeScreen/WelcomeScreen');
const PlaylistPage = () => import('../../components/PlaylistPage/PlaylistPage');

const paths = {
  private: {
    root: '/', playlist: '/p',
    artists: artistsPaths,
    tracks: tracksPaths,
    records: recordsPaths,
    releases: releasePaths,
  },
  
  public: {
    login: '/login',
  },
};
export {paths};

const routes = ArtistsRoutes.concat(TracksRoutes).
  concat(RecordsRoutes).concat(ReleasesRoutes).concat([
    {
      path: paths.private.root, component: WelcomeScreen,
    }, {
      path: paths.private.playlist, component: PlaylistPage,
    }]);

const router = new Router({
  mode: 'history',
  
  routes: [
    {
      path: paths.private.root,
      component: AuthenticatedPage,
      beforeEnter: assertAuthenticated,
      children: routes,
    },
    {
      path: paths.public.login,
      component: LoginPage,
      beforeEnter: assertNotAuthenticated,
    }],
});
export default router;
