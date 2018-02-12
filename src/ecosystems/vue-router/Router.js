import Vue from 'vue';
import Router from 'vue-router';
import Store from '../vuex/Store';

const LoginPage = () => import('../../components/LoginPage/LoginPage');
const AuthenticatedPage = () => import('../../components/AuthenticatedPage/AuthenticatedPage');
const WelcomeScreen = () => import('../../components/WelcomeScreen/WelcomeScreen');

const TracksList = () => import('./../../components/TracksList/TracksList');

const RecordsList = () => import('./../../components/RecordsList/RecordsList');

const ReleasesList = () => import('./../../components/ReleasesList/ReleasesList');
const ReleasesListDetailed = () => import('../../components/ReleasesListDetailed/ReleasesListDetailed');

const ArtistsList = () => import('../../components/ArtistsList/ArtistsList');
const ArtistsListDetailed = () => import('../../components/ArtistsListDetailed/ArtistsListDetailed');
const ArtistDetailsPage = () => import('../../components/ArtistDetailsPage/ArtistDetailsPage');
const ArtistReleasesList = () => import('../../components/ArtistReleasesList/ArtistReleasesList');
const ArtistRecordsList = () => import('../../components/ArtistRecordsList/ArtistRecordsList');
const ArtistReleaseDetailsPage = () => import('../../components/ArtistReleaseDetailsPage/ArtistReleaseDetailsPage');
const ArtistReleaseArtistsList = () => import('../../components/ArtistReleaseArtistsList/ArtistReleaseArtistsList');
const ArtistReleaseVariationsList = () => import('../../components/ArtistReleaseVariationsList/ArtistReleaseVariationsList');
const ArtistReleaseRecordsList = () => import('../../components/ArtistReleaseRecordsList/ArtistReleaseRecordsList');
const ArtistRecordDetailsPage = () => import('../../components/ArtistRecordDetailsPage/ArtistRecordDetailsPage');
const ArtistRecordArtistsList = () => import('../../components/ArtistRecordArtistsList/ArtistRecordArtistsList');
const ArtistRecordReleasesList = () => import('../../components/ArtistRecordReleasesList/ArtistRecordReleasesList');

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
      releasesLookup: {
        root: '/a/:id/r/:name',
        variants: '/a/:id/r/:name/v',
        artists: '/a/:id/r/:name/a',
        records: '/a/:id/r/:name/s',
      },
      records: '/a/:id/s',
      recordsLookup: {
        root: '/a/:id/s/:name',
        artists: '/a/:id/s/:name/a',
        releases: '/a/:id/s/:name/r',
      },
    },
    
    releases: {
      root: '/r', lookup: '/r/l/:name', details: '/r/:id',
    },
    
    records: {
      root: '/s',
      lookup: '/s/l/:name',
      details: '/s/:id',
      artists: '/s/:id/a',
      releases: '/s/:id/r',
    },
    
    tracks: {
      root: '/t',
    },
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

const assertNotAuthenticated = (to, from, next) => {
  if (Store.getters['auth/isAuthenticated']) {
    console.log('-> reroute authenticated request to private main');
    next(routes.private.root);
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
        },
        
        // tracks
        {
          path: routes.private.tracks.root,
          component: TracksList,
        },
        
        // records
        {
          path: routes.private.records.root,
          component: RecordsList,
        },
        
        // releases
        {
          path: routes.private.releases.root,
          component: ReleasesList,
        },
        {
          path: routes.private.releases.lookup,
          component: ReleasesListDetailed,
          props: true,
        },
        
        // artists
        {
          path: routes.private.artists.root,
          component: ArtistsList,
        },
        {
          path: routes.private.artists.lookup,
          component: ArtistsListDetailed,
          props: true,
        },
        {
          path: routes.private.artists.details,
          component: ArtistDetailsPage,
          redirect: routes.private.artists.releases,
          props: true,
          children: [
            {
              path: routes.private.artists.releases,
              component: ArtistReleasesList,
              props: true,
            },
            {
              path: routes.private.artists.records,
              component: ArtistRecordsList,
              props: true,
            }],
        },
        {
          path: routes.private.artists.releasesLookup.root,
          component: ArtistReleaseDetailsPage,
          redirect: routes.private.artists.releasesLookup.records,
          props: true,
          children: [
            {
              path: routes.private.artists.releasesLookup.records,
              component: ArtistReleaseRecordsList,
              props: true,
            },
            {
              path: routes.private.artists.releasesLookup.variants,
              component: ArtistReleaseVariationsList,
              props: true,
            },
            {
              path: routes.private.artists.releasesLookup.artists,
              component: ArtistReleaseArtistsList,
              props: true,
            },],
        },
        {
          path: routes.private.artists.recordsLookup.root,
          component: ArtistRecordDetailsPage,
          redirect: routes.private.artists.recordsLookup.artists,
          props: true,
          children: [
            {
              path: routes.private.artists.recordsLookup.artists,
              component: ArtistRecordArtistsList,
              props: true,
            },
            {
              path: routes.private.artists.recordsLookup.releases,
              component: ArtistRecordReleasesList,
              props: true,
            },],
        }],
    },
    {
      path: routes.public.login,
      component: LoginPage,
      beforeEnter: assertNotAuthenticated,
    }],
});
export default router;
