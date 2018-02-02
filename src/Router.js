import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import LoginPage from './pages/LoginPage';

export default new Router({
  routes: [
    {
      path: '/', redirect: {
        name: 'login',
      },
    }, {
      path: '/login', name: 'login', component: LoginPage,
    }], mode: 'history',
});
