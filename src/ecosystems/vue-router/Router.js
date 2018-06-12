import Vue from 'vue';
import Router from 'vue-router';

import {assertAuthenticated, assertNotAuthenticated,} from './RouterUtils';

import ArtistsRoutes, {paths as artistsPaths} from './routes/ArtistsRoutes';
import TracksRoutes, {paths as tracksPaths} from './routes/TracksRoutes';
import RecordsRoutes, {paths as recordsPaths} from './routes/RecordsRoutes';
import ReleasesRoutes, {paths as releasePaths} from './routes/ReleasesRoutes';
import PlaylistsRoutes, {paths as playlistsPaths} from './routes/PlaylistsRoutes';

Vue.use(Router);

const LoginPage = () => import('../../components/LoginPage/LoginPage');
const AuthenticatedPage = () => import('../../components/AuthenticatedPage/AuthenticatedPage');
const WelcomeScreen = () => import('../../components/WelcomeScreen/WelcomeScreen');
const InvitePage = () => import('../../components/InvitePage/InvitePage');
const RegisterPage = () => import('../../components/RegisterPage/RegisterPage');

const paths = {
  private: {
    root: '/',
    invite: '/i', playlists: playlistsPaths,
    artists: artistsPaths,
    tracks: tracksPaths,
    records: recordsPaths,
    releases: releasePaths,
  },
  
  public: {
    login: '/login', register: '/register/:token',
  },
};
export {paths};

const routes = ArtistsRoutes.concat(TracksRoutes).
  concat(RecordsRoutes).concat(ReleasesRoutes).concat(PlaylistsRoutes).concat([
    {
      path: paths.private.root, component: WelcomeScreen,
    }, {
      path: paths.private.invite, component: InvitePage,
    },]);

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
    },
    {
      path: paths.public.register,
      props: true,
      component: RegisterPage,
      beforeEnter: assertNotAuthenticated,
    }],
});
export default router;
