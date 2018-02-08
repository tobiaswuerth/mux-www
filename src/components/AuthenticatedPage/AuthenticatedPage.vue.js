import Router from '../../additions/vue-router/Router';
import Drawer from '../Drawer/Drawer.vue';
import Toolbar from '../Toolbar/Toolbar.vue';
import Footer from '../Footer/Footer.vue';
import FloatingActionButton from '../FloatingActionButton/FloatingActionButton.vue';
import Snackbar from '../Snackbar/Snackbar.vue';

export default {
  name: 'AuthenticatedPage', components: {
    Router,
    'my-drawer': Drawer,
    'my-toolbar': Toolbar,
    'my-fab': FloatingActionButton,
    'my-footer': Footer,
    'my-snackbar': Snackbar,
  },
};
