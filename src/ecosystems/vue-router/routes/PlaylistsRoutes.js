const CurrentPlaylistPage = () => import('../../../components/CurrentPlaylistPage/CurrentPlaylistPage');
const PlaylistsPage = () => import('../../../components/PlaylistsPage/PlaylistsPage');
const PlaylistDetailsPage = () => import('../../../components/PlaylistDetailsPage/PlaylistDetailsPage');
const PlaylistEditPage = () => import('../../../components/PlaylistEditPage/PlaylistEditPage');

export const paths = {
  root: '/p', current: '/p/c', edit: '/p/e/:id', details: '/p/v/:id',
};

export default [
  {
    path: paths.root, component: PlaylistsPage, props: true,
  }, {
    path: paths.current, component: CurrentPlaylistPage, props: true,
  }, {
    path: paths.details, component: PlaylistDetailsPage, props: true,
  }, {
    path: paths.edit, component: PlaylistEditPage, props: true,
  }];
