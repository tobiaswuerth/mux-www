import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
// modules
import RepositoryModule from './modules/RepositoryModule';
import AuthenticationModule from './modules/AuthenticationModule';
import ArtistsModule from './modules/ArtistsModule';
import ReleasesModule from './modules/ReleasesModule';
import RecordsModule from './modules/RecordsModule';
import TracksModule from './modules/TracksModule';
import SnackbarModule from './modules/SnackbarModule';
import WatchModule, {watcher} from './modules/WatchModule';
import AudioModule from './modules/AudioModule';

Vue.use(Vuex);

const persistenceModule = new VuexPersistence({
  storage: window.localStorage, modules: [
    'auth' //todo
  ],
});

const store = new Vuex.Store({
  modules: {
    repo: RepositoryModule,
    auth: AuthenticationModule,
    watch: WatchModule,
    artists: ArtistsModule,
    releases: ReleasesModule,
    records: RecordsModule,
    tracks: TracksModule,
    snackbar: SnackbarModule,
    audio: AudioModule,
  },
  
  plugins: [
    persistenceModule.plugin],
});

export default store;

// additional initializing
// note: this is after 'default export' because these actions may require a
// reference to this store module
watcher.initialize();
