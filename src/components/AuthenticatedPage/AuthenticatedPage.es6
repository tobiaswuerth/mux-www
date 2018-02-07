import Router from '../../additions/vue-router/Router';
import Drawer from '../LayoutDrawer/Drawer';
import Toolbar from '../Toolbar/Toolbar';
import Footer from '../Footer/Footer';
import FloatingActionButton from '../FloatingActionButton/FloatingActionButton';
import Snackbar from '../Snackbar/Snackbar';

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
