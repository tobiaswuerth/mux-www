import Router from './../Router';
import {prepareRoute} from './../RouterUtils';
import List from './../../../components/List/List';
import {clone} from './../../../scripts/Utils';
import ReleaseDetailsPage from './../../../components/ReleaseDetailsPage/ReleaseDetailsPage';
import {
  onAfterMap, onAfterSingle, onAfterSort, simplyLoad,
} from '../../../scripts/DataLoaderUtils';
import {paths as recordsPaths} from './RecordsRoutes';
import {paths as artistsPaths} from './ArtistsRoutes';

import ReleasesListDetailed from '../../../components/ReleasesListDetailed/ReleasesListDetailed';

export const paths = {
  root: '/r',
  lookup: '/r/l/:name',
  details: '/r/:id',
  artists: '/r/:id/a',
  records: '/r/:id/s',
  variations: '/r/:id/r',
};

export default [
  {
    path: paths.root,
    component: clone(List),
    props: {
      route: 'releases/all',
      valueKey: 'Title',
      toString1: (i) => i.Title,
      onClick: (i) => {
        Router.push(prepareRoute(paths.lookup, {name: i.Title}));
      },
    },
  },
  {
    path: paths.lookup,
    component: clone(ReleasesListDetailed),
    props: {
      route: 'releases/byName',
      payload: async (p) => p,
      doPreload: true,
      onAfter: (loader) => {
        if (loader.dataSource.data.length === 1) {
          // auto select record
          let id = loader.dataSource.data[0].UniqueId;
          Router.push(paths.details.replace(':id', encodeURIComponent(id)));
        }
      },
    },
  },
  {
    path: paths.details,
    component: ReleaseDetailsPage,
    props: true,
    redirect: paths.records,
    children: [
      {
        path: paths.records, component: clone(List), props: {
          route: 'releases/recordsById',
          valueKey: 'UniqueId',
          payload: async (p) => p,
          onAfter: onAfterSort,
          toString1: (i) => i.Title,
          onClick: (i) => Router.push(
            prepareRoute(recordsPaths.details, {id: i.UniqueId})),
        },
      }, {
        path: paths.artists, component: clone(List), props: {
          route: 'releases/artistsById',
          valueKey: 'UniqueId',
          showAvatar: true,
          doInsetDivider: true,
          payload: async (p) => p,
          onAfter: [onAfterMap(i => i.Artist), onAfterSort],
          toString1: (i) => i.Name,
          toString2: (i) => i.Disambiguation,
          toString3: (i) => i.Aliases.length > 0 ? `a.k.a. ${i.Aliases.map(
            a => a.Name).join(', ')}` : '',
          onClick: (i) => Router.push(
            prepareRoute(artistsPaths.details, {id: i.UniqueId})),
        },
      }, {
        path: paths.variations, component: clone(ReleasesListDetailed), props: {
          route: 'releases/byName',
          payload: async (p) => await simplyLoad('releases/byId', p, [
            onAfterMap(
              (i) => i.Title.variations().map(t => Object.assign({name: t}))),
            onAfterSingle]),
          doPreload: true,
        },
      },],
  },

];

