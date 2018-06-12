const CurrentPlaylistPage = () => import('../../../components/CurrentPlaylistPage/CurrentPlaylistPage');

export const paths = {
  root: '/p', current: '/p/c',
};

export default [
  {
    path: paths.current, component: CurrentPlaylistPage,
    
  },];
