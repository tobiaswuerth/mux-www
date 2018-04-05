import List from './../../../components/List/List';
import {clone} from '../../../scripts/DataUtils';
import {secondsToReadableString} from './../../../scripts/Utils';
import Store from './../../vuex/Store';

export const paths = {
  root: '/t', search: '/t/s/:name',
};

export default [
  {
    path: paths.root, component: clone(List), props: {
      route: 'tracks/all',
      toString1: (i) => i.Path,
      onClick: () => {},
      toString2: (i) => secondsToReadableString(i.Duration),
      actionsLeft: [
        {
          icon: 'play_arrow',
          onClick: (i) => Store.dispatch('audio/play', {track: i}).
            catch(console.error),
          isRaised: true,
          isRound: true,
        }],
      actionsRight: [
        {
          icon: 'playlist_add',
          onClick: (i) => Store.dispatch('audio/addToPlaylist', {track: i}).
            catch(console.error),
          isRaised: false,
          isRound: false,
        }],
    },
  }, {
    path: paths.search, component: clone(List), props: {
      route: 'tracks/likeName',
      toString1: (i) => i.Path,
      payload: async (p) => p,
      onClick: () => {},
      toString2: (i) => secondsToReadableString(i.Duration),
      actionsLeft: [
        {
          icon: 'play_arrow',
          onClick: (i) => Store.dispatch('audio/play', {track: i}).
            catch(console.error),
          isRaised: true,
          isRound: true,
        }],
      actionsRight: [
        {
          icon: 'playlist_add',
          onClick: (i) => Store.dispatch('audio/addToPlaylist', {track: i}).
            catch(console.error),
          isRaised: false,
          isRound: false,
        }],
    },
  },];
