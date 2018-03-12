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
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      let string = (msg || '').toLowerCase();
      let substring = 'script error';
      if (string.indexOf(substring) > -1) {
        Store.dispatch('snackbar/hint',
          'Script Error: See Browser Console for Detail');
        return false;
      }
      
      let message = [
        'Message: ' + msg, 'URL: ' + url, 'Line: ' + lineNo,
        'Column: ' + columnNo, 'Error object: ' + JSON.stringify(error)].join(
        ' - ');
      Store.dispatch('snackbar/hint', message);
      return false;
    };
  },
  
  computed: {
    dataSnackbar: function() {
      return Store.getters['snackbar/data'];
    },
  },
};
