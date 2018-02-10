import Vue from 'vue';
import Router from 'vue-router';
import Store from '../vuex/Store';

import LoginPage from '../../components/LoginPage/LoginPage';
import AuthenticatedPage from '../../components/AuthenticatedPage/AuthenticatedPage';
import WelcomeScreen from '../../components/WelcomeScreen/WelcomeScreen';

import TracksList from './../../components/TracksList/TracksList';

import RecordsList from './../../components/RecordsList/RecordsList';

import ReleasesList from './../../components/ReleasesList/ReleasesList';
import ReleasesByNameList from './../../components/ReleasesByNameList/ReleasesByNameList';

import ArtistsList from '../../components/ArtistsList/ArtistsList';
import ArtistsByNameList from '../../components/ArtistsByNameList/ArtistsByNameList';
import ArtistDetailsPage from '../../components/ArtistDetailsPage/ArtistDetailsPage';
import ArtistReleasesList from '../../components/ArtistReleasesList/ArtistReleasesList';
import ArtistRecordsList from '../../components/ArtistRecordsList/ArtistRecordsList';
import ArtistReleaseDetailsPage from '../../components/ArtistReleaseDetailsPage/ArtistReleaseDetailsPage';

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
      },
      records: '/a/:id/s',
      recordsLookup: '/a/:id/s/:name',
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
      root: '/t', details: '/t/:id',
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
          component: ReleasesByNameList,
          props: true,
        },
        
        // artists
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
          props: true,
        },
        {
          path: routes.private.artists.releasesLookup.variants,
          component: ArtistReleaseDetailsPage,
          props: true,
        },
        {
          path: routes.private.artists.releasesLookup.artists,
          component: ArtistReleaseDetailsPage,
          props: true,
        },
      
      ],
    },
    {
      path: routes.public.login,
      component: LoginPage,
    }],
});
export default router;
