import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
// modules
import RepositoryModule from './modules/RepositoryModule';
import AuthenticationModule from './modules/AuthenticationModule';
import ArtistsModule from './modules/ArtistsModule';
import ReleasesModule from './modules/ReleasesModule';
import WatchModule, {watcher} from './modules/WatchModule';

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
  },
  
  plugins: [
    persistenceModule.plugin],
});

export default store;

// additional initializing
// note: this is after 'default export' because these actions may require a
// reference to this store module
watcher.initialize();
