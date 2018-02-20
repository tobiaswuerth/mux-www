import Vue from 'vue';
import Router from 'vue-router';
import Routes from './Routes';
import List from './../../components/List/List';
import {
  assertAuthenticated, assertNotAuthenticated, prepareRoute,
} from './RouterUtils';
import {
  onAfterSort, onAfterUnique, simplyLoad,
} from './../../scripts/DataLoader';

Vue.use(Router);

const LoginPage = () => import('../../components/LoginPage/LoginPage');
const AuthenticatedPage = () => import('../../components/AuthenticatedPage/AuthenticatedPage');
const WelcomeScreen = () => import('../../components/WelcomeScreen/WelcomeScreen');

const TracksList = () => import('./../../components/TracksList/TracksList');

const ReleasesListDetailed = () => import('../../components/ReleasesListDetailed/ReleasesListDetailed');

const ArtistsListDetailed = () => import('../../components/ArtistsListDetailed/ArtistsListDetailed');
const ArtistDetailsPage = () => import('../../components/ArtistDetailsPage/ArtistDetailsPage');
const ArtistReleasesList = () => import('../../components/ArtistReleasesList/ArtistReleasesList');
const ArtistReleaseDetailsPage = () => import('../../components/ArtistReleaseDetailsPage/ArtistReleaseDetailsPage');
const ArtistReleaseArtistsList = () => import('../../components/ArtistReleaseArtistsList/ArtistReleaseArtistsList');
const ArtistReleaseVariationsList = () => import('../../components/ArtistReleaseVariationsList/ArtistReleaseVariationsList');
const ArtistRecordDetailsPage = () => import('../../components/ArtistRecordDetailsPage/ArtistRecordDetailsPage');
const ArtistRecordArtistsList = () => import('../../components/ArtistRecordArtistsList/ArtistRecordArtistsList');
const ArtistRecordReleasesList = () => import('../../components/ArtistRecordReleasesList/ArtistRecordReleasesList');

const ListFactory = () => Object.assign({}, List);

const router = new Router({
  mode: 'history',
  
  routes: [
    {
      path: Routes.private.root,
      component: AuthenticatedPage,
      beforeEnter: assertAuthenticated,
      children: [
        {
          path: Routes.private.root,
          component: WelcomeScreen,
        },
        
        // tracks
        {
          path: Routes.private.tracks.root,
          component: TracksList,
        },
        
        // records
        {
          path: Routes.private.records.root,
          component: ListFactory(),
          props: {
            route: 'records/all',
            valueKey: 'Title',
            textKey: 'Title',
            onClick: (i) => {
              router.push(
                prepareRoute(Routes.private.records.lookup, {name: i.Title}));
            },
          },
        },
        
        // releases
        {
          path: Routes.private.releases.root,
          component: ListFactory(),
          props: {
            route: 'releases/all',
            valueKey: 'Title',
            textKey: 'Title',
            onClick: (i) => {
              router.push(
                prepareRoute(Routes.private.releases.lookup, {name: i.Title}));
            },
          },
        },
        {
          path: Routes.private.releases.lookup,
          component: ReleasesListDetailed,
          props: true,
        },
        
        // artists
        {
          path: Routes.private.artists.root,
          component: ListFactory(),
          props: {
            route: 'artists/all',
            textKey: 'Name',
            valueKey: 'Name',
            onClick: (i) => {
              router.push(
                prepareRoute(Routes.private.artists.lookup, {name: i.Name}));
            },
          },
        },
        {
          path: Routes.private.artists.lookup,
          component: ArtistsListDetailed,
          props: true,
        },
        {
          path: Routes.private.artists.details,
          component: ArtistDetailsPage,
          redirect: Routes.private.artists.releases,
          props: true,
          children: [
            {
              path: Routes.private.artists.releases,
              component: ArtistReleasesList,
              props: true,
            },
            {
              path: Routes.private.artists.records,
              component: ListFactory(),
              props: {
                route: 'artists/recordsById',
                valueKey: 'Title',
                textKey: 'Title',
                onAfter: onAfterUnique,
                payload: async (p) => p,
                onClick: (i, p) => {
                  router.push(
                    prepareRoute(Routes.private.artists.recordsLookup.root,
                      {id: p.id, name: i.Title}));
                },
              },
            }],
        },
        {
          path: Routes.private.artists.releasesLookup.root,
          component: ArtistReleaseDetailsPage,
          redirect: Routes.private.artists.releasesLookup.records,
          props: true,
          children: [
            {
              path: Routes.private.artists.releasesLookup.records,
              component: ListFactory(),
              props: {
                route: 'releases/recordsById',
                valueKey: 'Title',
                textKey: 'Title',
                onAfter: [onAfterUnique, onAfterSort],
                payload: async (p) => await simplyLoad('artists/releasesById',
                  {id: p.id}, (i) => i.Title === p.name,
                  (i) => Object.assign({id: i.UniqueId})),
                onClick: (i, p) => {
                  router.push(
                    prepareRoute(Routes.private.artists.recordsLookup.root,
                      {id: p.id, name: i.Title}));
                },
              },
            },
            {
              path: Routes.private.artists.releasesLookup.variants,
              component: ArtistReleaseVariationsList,
              props: true,
            },
            {
              path: Routes.private.artists.releasesLookup.artists,
              component: ArtistReleaseArtistsList,
              props: true,
            },],
        },
        {
          path: Routes.private.artists.recordsLookup.root,
          component: ArtistRecordDetailsPage,
          redirect: Routes.private.artists.recordsLookup.artists,
          props: true,
          children: [
            {
              path: Routes.private.artists.recordsLookup.artists,
              component: ArtistRecordArtistsList,
              props: true,
            },
            {
              path: Routes.private.artists.recordsLookup.releases,
              component: ArtistRecordReleasesList,
              props: true,
            },],
        }],
    },
    {
      path: Routes.public.login,
      component: LoginPage,
      beforeEnter: assertNotAuthenticated,
    }],
});
export default router;
