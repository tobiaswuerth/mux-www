import router from './../Router';
import {prepareRoute} from './../RouterUtils';
import List from './../../../components/List/List';
import {clone} from './../../../scripts/Utils';

const ReleasesListDetailed = () => import('../../../components/ReleasesListDetailed/ReleasesListDetailed');

export const paths = {
  root: '/r', lookup: '/r/l/:name', details: '/r/:id',
};

export default [
  {
    path: paths.root, component: clone(List), props: {
      route: 'releases/all',
      valueKey: 'Title',
      toString1: (i) => i.Title,
      onClick: (i) => {
        router.push(prepareRoute(paths.lookup, {name: i.Title}));
      },
    },
  }, {
    path: paths.lookup, component: ReleasesListDetailed, props: true,
  },];
