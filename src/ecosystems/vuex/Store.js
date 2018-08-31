import Vue from 'vue';
import Vuex from 'vuex';
// modules
import RepositoryModule from './modules/RepositoryModule';
import AuthenticationModule from './modules/AuthenticationModule';
import ArtistsModule from './modules/ArtistsModule';
import ReleasesModule from './modules/ReleasesModule';
import RecordsModule from './modules/RecordsModule';
import TracksModule from './modules/TracksModule';
import GlobalModule from './modules/GlobalModule';
import AudioModule from './modules/AudioModule';
import InvitesModule from './modules/InvitesModule';
import PlaylistsModule from './modules/PlaylistsModule';
import UsersModule from './modules/UserModule';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    repo: RepositoryModule,
    auth: AuthenticationModule,
    artists: ArtistsModule,
    releases: ReleasesModule,
    records: RecordsModule,
    tracks: TracksModule,
    global: GlobalModule,
    audio: AudioModule,
    invites: InvitesModule,
    playlists: PlaylistsModule,
    users: UsersModule,
  },
});

export default store;
