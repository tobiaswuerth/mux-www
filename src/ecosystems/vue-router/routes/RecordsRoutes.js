import router from './../Router';
import {prepareRoute} from './../RouterUtils';
import List from './../../../components/List/List';
import {clone} from './../../../scripts/Utils';

const paths = {
  root: '/s',
  lookup: '/s/l/:name',
  details: '/s/:id',
  artists: '/s/:id/a',
  releases: '/s/:id/r',
};
export {paths};

export default [
  {
    path: paths.root, component: clone(List), props: {
      route: 'records/all',
      valueKey: 'Title',
      toString1: (i) => i.Title,
      onClick: (i) => {
        router.push(prepareRoute(paths.lookup, {name: i.Title}));
      },
    },
  },];
