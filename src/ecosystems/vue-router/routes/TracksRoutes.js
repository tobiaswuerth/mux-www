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
      toString2: (i) => secondsToReadableString(i.Duration), actionsRight: [
        {
          icon: 'playlist_add',
          type: '',
          text: 'Add to a playlist',
          onClick: (i) => Store.dispatch('audio/addToPlaylist',
            {trackId: i.UniqueId, title: i.Path}).
            catch(console.error),
          isRaised: false,
          isRound: true,
        },
        {
          icon: 'playlist_play',
          type: '',
          text: 'Add to currently playing list',
          onClick: (i) => Store.dispatch('audio/addToCurrentPlaylist',
            {track: i}).
            catch(console.error),
          isRaised: false,
          isRound: true,
        },
        {
          icon: 'play_arrow',
          type: 'primary',
          text: 'Play track',
          onClick: (i) => Store.dispatch('audio/play', {track: i}).
            catch(console.error),
          isRaised: true,
          isRound: true,
          alwaysVisible: true,
        }],
    },
  }, {
    path: paths.search, component: clone(List), props: {
      route: 'tracks/likeName',
      payload: async (p) => p, toString1: (i) => i.Path,
      toString2: (i) => secondsToReadableString(i.Duration), actionsRight: [
        {
          icon: 'playlist_add',
          type: '',
          text: 'Add to a playlist',
          onClick: (i) => Store.dispatch('audio/addToPlaylist',
            {trackId: i.UniqueId, title: i.Path}).
            catch(console.error),
          isRaised: false,
          isRound: true,
        },
        {
          icon: 'playlist_play',
          type: '',
          text: 'Add to currently playing list',
          onClick: (i) => Store.dispatch('audio/addToCurrentPlaylist',
            {track: i}).
            catch(console.error),
          isRaised: false,
          isRound: true,
        },
        {
          icon: 'play_arrow',
          type: 'primary',
          text: 'Play track',
          onClick: (i) => Store.dispatch('audio/play', {track: i}).
            catch(console.error),
          isRaised: true,
          isRound: true,
          alwaysVisible: true,
        }],
    },
  },];
