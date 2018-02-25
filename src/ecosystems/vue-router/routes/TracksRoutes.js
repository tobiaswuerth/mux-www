const TracksList = () => import('./../../../components/TracksList/TracksList');

export const paths = {
  root: '/t',
};

export default [
  {
    path: paths.root, component: TracksList,
  }];
