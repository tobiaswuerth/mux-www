import Router from './../Router';
import {prepareRoute} from './../RouterUtils';
import List from './../../../components/List/List';
import {clone} from './../../../scripts/Utils';
import ReleaseDetailsPage from './../../../components/ReleaseDetailsPage/ReleaseDetailsPage';
import {onAfterSelect} from '../../../scripts/DataLoaderUtils';
import {paths as recordsPaths} from './RecordsRoutes';
import {paths as artistsPaths} from './ArtistsRoutes';
import {onAfterSort} from './../../../scripts/DataLoaderUtils';

const ReleasesListDetailed = () => import('../../../components/ReleasesListDetailed/ReleasesListDetailed');

export const paths = {
  root: '/r',
  lookup: '/r/l/:name',
  details: '/r/:id',
  artists: '/r/:id/a',
  records: '/r/:id/s',
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
    component: ReleasesListDetailed,
    props: true,
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
          onAfter: [onAfterSelect('Artist'), onAfterSort],
          toString1: (i) => i.Name,
          toString2: (i) => i.Disambiguation,
          toString3: (i) => i.Aliases.length > 0 ? `a.k.a. ${i.Aliases.map(
            a => a.Name).join(', ')}` : '',
          onClick: (i) => Router.push(
            prepareRoute(artistsPaths.details, {id: i.UniqueId})),
        },
      },],
  },

];

