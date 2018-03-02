import Router from './../Router';
import {prepareRoute} from './../RouterUtils';
import {simplyLoad,} from '../../../scripts/DataLoaderUtils';
import List from './../../../components/List/List';
import {clone} from './../../../scripts/Utils';
import {
  onAfterSelect, onAfterSort, onAfterUnique,
} from './../../../scripts/DataLoaderUtils';

const ArtistsListDetailed = () => import('./../../../components/ArtistsListDetailed/ArtistsListDetailed');
const ArtistDetailsPage = () => import('./../../../components/ArtistDetailsPage/ArtistDetailsPage');
const ArtistReleasesList = () => import('./../../../components/ArtistReleasesList/ArtistReleasesList');
const ArtistReleaseDetailsPage = () => import('./../../../components/ArtistReleaseDetailsPage/ArtistReleaseDetailsPage');
const ArtistReleaseVariationsList = () => import('./../../../components/ArtistReleaseVariationsList/ArtistReleaseVariationsList');
const ArtistRecordDetailsPage = () => import('./../../../components/ArtistRecordDetailsPage/ArtistRecordDetailsPage');
const ArtistRecordReleasesList = () => import('./../../../components/ArtistRecordReleasesList/ArtistRecordReleasesList');

export const paths = {
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
};

export default [
  {
    path: paths.root,
    component: clone(List),
    props: {
      route: 'artists/all',
      toString1: (i) => i.Name,
      valueKey: 'Name',
      onClick: (i) => {
        Router.push(prepareRoute(paths.lookup, {name: i.Name}));
      },
    },
  },
  {
    path: paths.lookup,
    component: ArtistsListDetailed,
    props: true,
  },
  {
    path: paths.details,
    component: ArtistDetailsPage,
    redirect: paths.releases,
    props: true,
    children: [
      {
        path: paths.releases, component: ArtistReleasesList, props: true,
      }, {
        path: paths.records, component: clone(List), props: {
          route: 'artists/recordsById',
          valueKey: 'Title',
          id: {},
          name: {},
          toString1: (i) => i.Title,
          payload: async (p) => p,
          onAfter: onAfterUnique,
          onClick: (i, p) => {
            Router.push(prepareRoute(paths.recordsLookup.root,
              {id: p.id, name: i.Title}));
          },
        },
      }],
  },
  {
    path: paths.releasesLookup.root,
    component: ArtistReleaseDetailsPage,
    redirect: paths.releasesLookup.records,
    props: true,
    children: [
      {
        path: paths.releasesLookup.records,
        component: clone(List),
        props: {
          route: 'releases/recordsById',
          valueKey: 'Title',
          toString1: (i) => i.Title,
          onAfter: [onAfterUnique, onAfterSort],
          doPreload: true,
          payload: async (p) => await simplyLoad('artists/releasesById',
            {id: p.id}, (i) => i.Title.normalize() === p.name.normalize(),
            (i) => Object.assign({id: i.UniqueId})),
          onClick: (i, p) => {
            Router.push(prepareRoute(paths.recordsLookup.root,
              {id: p.id, name: i.Title}));
          },
        },
      },
      {
        path: paths.releasesLookup.variants,
        component: ArtistReleaseVariationsList,
        props: true,
      },
      {
        path: paths.releasesLookup.artists,
        component: clone(List),
        props: {
          route: 'releases/artistsById',
          valueKey: 'UniqueId',
          toString1: (i) => i.Name,
          toString2: (i) => i.Disambiguation,
          toString3: (i) => i.Aliases.length > 0 ? `a.k.a. ${i.Aliases.map(
            a => a.Name).
            join(', ')}` : '',
          onAfter: [onAfterSelect('Artist'), onAfterUnique, onAfterSort],
          showAvatar: true,
          doInsetDivider: true,
          payload: async (p) => await simplyLoad('artists/releasesById',
            {id: p.id}, (i) => i.Title.normalize() === p.name.normalize(),
            (i) => Object.assign({id: i.UniqueId})),
          onClick: (i, p) => Router.push(
            prepareRoute(paths.details, {id: i.UniqueId})),
        },
      },],
  },
  {
    path: paths.recordsLookup.root,
    component: ArtistRecordDetailsPage, //redirect: paths.recordsLookup.artists,
    props: true,
    children: [
      {
        path: paths.recordsLookup.artists,
        component: clone(List),
        props: true,
      },
      {
        path: paths.recordsLookup.releases,
        component: ArtistRecordReleasesList,
        props: true,
      },],
  }];
