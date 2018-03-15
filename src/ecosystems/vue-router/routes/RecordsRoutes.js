import Router from './../Router';
import {prepareRoute} from './../RouterUtils';
import List from './../../../components/List/List';
import {clone, secondsToReadableString} from './../../../scripts/Utils';
import Store from './../../vuex/Store';
import {onAfterMap, onAfterSort,} from './../../../scripts/DataLoaderUtils';
import {paths as artistPaths} from './ArtistsRoutes';

const RecordDetailsPage = () => import('./../../../components/RecordDetailsPage/RecordDetailsPage');

export const paths = {
  root: '/s', lookup: '/s/l/:name', search: '/s/s/:name',
  details: '/s/:id',
  artists: '/s/:id/a',
  releases: '/s/:id/r',
};

export default [
  {
    path: paths.root,
    component: clone(List),
    props: {
      route: 'records/all',
      valueKey: 'Title',
      toString1: (i) => i.Title,
      onClick: (i) => {
        Router.push(prepareRoute(paths.lookup, {name: i.Title}));
      },
    },
  },
  {
    path: paths.search,
    component: clone(List),
    props: {
      route: 'records/likeName',
      toString1: (i) => i.Title,
      payload: async (p) => p,
      valueKey: 'Title',
      onClick: (i) => {
        Store.commit('global/searchQuery', '');
        Router.push(prepareRoute(paths.lookup, {name: i.Title}));
      },
    },
  },
  {
    path: paths.lookup,
    component: clone(List),
    props: {
      route: 'records/byName',
      valueKey: 'UniqueId',
      toString1: (i) => i.Title,
      toString2: (i) => i.Disambiguation,
      toString3: (i) => i.Length ? `Length: ${secondsToReadableString(i.Length /
        1000)} min` : '',
      showAvatar: true,
      doInsetDivider: true, payload: async (p) => p, onAfter: (p) => {
        let data = p.dataSource.data;
        if (data.length === 1) {
          Router.push(prepareRoute(paths.details, {id: data[0].UniqueId}));
        }
      },
      onClick: (i) => Router.push(
        prepareRoute(paths.details, {id: i.UniqueId})),
    },
  },
  {
    path: paths.details,
    redirect: paths.artists,
    component: RecordDetailsPage,
    props: true,
    children: [
      {
        path: paths.artists, component: clone(List), props: {
          route: 'records/artistsById',
          valueKey: 'UniqueId',
          toString1: (i) => i.Name,
          toString2: (i) => i.Disambiguation,
          toString3: (i) => i.Aliases.length > 0 ? `a.k.a. ${i.Aliases.map(
            a => a.Name).
            join(', ')}` : '',
          onAfter: [
            onAfterMap(i => i.Artist), onAfterSort],
          showAvatar: true,
          doInsetDivider: true,
          payload: async (p) => p,
          onClick: (i) => Router.push(
            prepareRoute(artistPaths.details, {id: i.UniqueId})),
        },
        
      }],
  }];
