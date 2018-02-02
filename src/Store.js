import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import AuthenticationModule from './modules/AuthenticationModule';
import RepositoryModule from './modules/RepositoryModule';

export default new Vuex.Store({
  modules: {
    auth: AuthenticationModule, repo: RepositoryModule,
  },
});

