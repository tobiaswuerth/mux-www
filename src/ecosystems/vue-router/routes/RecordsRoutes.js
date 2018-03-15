import Router from './../Router';
import {prepareRoute} from './../RouterUtils';
import List from './../../../components/List/List';
import {clone, secondsToReadableString} from './../../../scripts/Utils';
import Store from './../../vuex/Store';

export const paths = {
  root: '/s',
  lookup: '/s/l/:name', search: '/s/s/:name',
  details: '/s/:id',
  artists: '/s/:id/a',
  releases: '/s/:id/r',
};

export default [
  {
    path: paths.root, component: clone(List), props: {
      route: 'records/all',
      valueKey: 'Title',
      toString1: (i) => i.Title,
      onClick: (i) => {
        Router.push(prepareRoute(paths.lookup, {name: i.Title}));
      },
    },
  }, {
    path: paths.search, component: clone(List), props: {
      route: 'records/likeName',
      toString1: (i) => i.Title,
      payload: async (p) => p,
      valueKey: 'Title',
      onClick: (i) => {
        Store.commit('global/searchQuery', '');
        Router.push(prepareRoute(paths.lookup, {name: i.Title}));
      },
    },
  }, {
    path: paths.lookup, component: clone(List), props: {
      route: 'records/byName',
      valueKey: 'UniqueId',
      toString1: (i) => i.Title,
      toString2: (i) => i.Disambiguation,
      toString3: (i) => i.Length ? `Length: ${secondsToReadableString(i.Length /
        1000)} min` : '',
      showAvatar: true,
      doInsetDivider: true,
      payload: async (p) => p,
      onClick: (i) => Router.push(
        prepareRoute(paths.details, {id: i.UniqueId})),
    },
  },];
