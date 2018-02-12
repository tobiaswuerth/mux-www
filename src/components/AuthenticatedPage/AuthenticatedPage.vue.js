import Router from '../../ecosystems/vue-router/Router';
import Drawer from '../Drawer/Drawer.vue';
import Toolbar from '../Toolbar/Toolbar.vue';
import Footer from '../Footer/Footer.vue';
import FloatingActionButton from '../FloatingActionButton/FloatingActionButton.vue';
import Snackbar from '../Snackbar/Snackbar.vue';
import Store from '../../ecosystems/vuex/Store';

export default {
  name: 'AuthenticatedPage',
  
  components: {
    Router, Drawer, Toolbar, FloatingActionButton, Footer, Snackbar,
  },
  
  mounted: function() {
    window.onerror = function(message) {
      Store.dispatch('snackbar/hint', message);
      return true;
    };
  },
  
  computed: {
    dataSnackbar: function() {
      return Store.getters['snackbar/data'];
    },
  },
};
