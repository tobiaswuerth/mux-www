// modules
import Vue from 'vue';
import VueMaterial from 'vue-material';

// components
import App from './components/App';

// css
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'material-design-icons/iconfont/material-icons.css';

// js
import Store from './Store';
import Router from './Router';

// usage
Vue.use(Router);
Vue.use(Store);
Vue.use(VueMaterial);

// config
Vue.config.productionTip = false;

window.vm = new Vue({
  el: '#app',
  router: Router,
  store: Store,
  components: {App},
  template: '<App/>',
});
