import Router from '../../ecosystems/vue-router/Router';
import Drawer from '../Drawer/Drawer.vue';
import Toolbar from '../Toolbar/Toolbar.vue';
import Footer from '../Footer/Footer.vue';
import FloatingActionButton from '../FloatingActionButton/FloatingActionButton.vue';

export default {
  name: 'AuthenticatedPage',
  
  components: {
    Router, Drawer, Toolbar, FloatingActionButton, Footer,
  },
};
