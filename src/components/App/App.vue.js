import Router from '../../ecosystems/vue-router/Router';
import Snackbar from '../Snackbar/Snackbar';
import Store from './../../ecosystems/vuex/Store';
import Overlay, {types as overlayTypes} from './../Overlay/Overlay.vue';

export default {
  name: 'App', components: {
    Router, Snackbar, Overlay,
  },
  
  mounted: function() {
    window.addEventListener('error', function(e) {
      let empty = 'N/A';
      let message = (e.message || empty);
      let file = (e.filename || empty);
      let lineno = (e.lineno || empty);
      let colno = (e.colno || empty);
      let error = (e.error || {});
    
      let result = `An unhandled error occurred. Please provide the following
      information to your system administrator. Message: '${message}', @${file}[${lineno}#${colno}], Details: ${JSON.stringify(
        error)}`;
    
      Store.dispatch('global/displayOverlay', {
        type: overlayTypes.none, display: true, text: result, closeable: true,
      }).catch(console.error);
      
      return false;
    });
  },
  
  computed: {
    dataSnackbar: function() {
      return Store.getters['global/hints'];
    },
  
    overlayData: function() {
      return Store.getters['global/overlayData'];
    },
  },
};
