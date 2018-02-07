// modules
import Vue from 'vue';
import VueMaterial from 'vue-material';
// components
import App from '../../components/App/App';
// css
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'material-design-icons/iconfont/material-icons.css';
import '../../globals/global.css';
// js
import Store from './../vuex/Store';
import Router from '../vue-router/Router';

// usage
Vue.use(VueMaterial);
Vue.use(Router);
Vue.use(Store);

// config
Vue.config.productionTip = false;

window.vm = new Vue({
  el: '#app',
  render: h => h(App),
  router: Router,
  store: Store,
  components: {App},
});
