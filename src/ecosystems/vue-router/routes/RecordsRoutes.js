import Router from './../Router';
import {prepareRoute} from './../RouterUtils';
import List from './../../../components/List/List';
import ReleasesListDetailed from './../../../components/ReleasesListDetailed/ReleasesListDetailed';
import {secondsToReadableString} from './../../../scripts/Utils';
import {onAfterMap, onAfterSort,} from './../../../scripts/DataLoaderUtils';
import {paths as artistPaths} from './ArtistsRoutes';
import {clone} from './../../../scripts/DataUtils';

const RecordDetailsPage = () => import('./../../../components/RecordDetailsPage/RecordDetailsPage');

export const paths = {
  root: '/s',
  lookup: '/s/l/:name',
  search: '/s/s/:name',
  details: '/s/:id',
  artists: '/s/:id/a',
  releases: '/s/:id/r',
};

export default [
  {
    path: paths.root,
    component: clone(List),
    props: {
      route: 'records/all', toString1: (i) => i.Title, onClick: (i) => {
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
      onClick: (i) => {
        Router.push(prepareRoute(paths.lookup, {name: i.Title}));
      },
    },
  },
  {
    path: paths.lookup,
    component: clone(List),
    props: {
      route: 'records/byName',
      toString1: (i) => i.Title,
      toString2: (i) => i.Disambiguation,
      toString3: (i) => i.Length ? `Length: ${secondsToReadableString(i.Length /
        1000)} min` : '',
      showAvatar: true,
      doInsetDivider: true,
      payload: async (p) => p,
      onAfter: (p) => {
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
      }, {
        path: paths.releases, component: clone(ReleasesListDetailed), props: {
          route: 'records/releasesById',
          payload: async (p) => p,
          doPreload: true,
        },
        
      },],
  }];
