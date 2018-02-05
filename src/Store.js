import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

// modules
import AuthenticationModule from './modules/AuthenticationModule';
import RepositoryModule from './modules/RepositoryModule';
import WatchModule, {watcher} from './modules/WatchModule';

const persistenceModule = new VuexPersistence({
  storage: window.localStorage,
  modules: [
    'auth' //todo
  ]
});

const store = new Vuex.Store({
  modules: {
    'repo': RepositoryModule,
    'auth': AuthenticationModule,
    'watch': WatchModule,
  },

  plugins: [
    persistenceModule.plugin
  ],
});

export default store;

// additional initializing
// note: this is after 'default export' because these actions may require a
// reference to this store module
watcher.initialize();
