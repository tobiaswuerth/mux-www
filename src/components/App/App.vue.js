import Router from '../../ecosystems/vue-router/Router';
import Snackbar from '../Snackbar/Snackbar';
import Store from './../../ecosystems/vuex/Store';
import Overlay, {types as overlayTypes} from './../Overlay/Overlay.vue';

export default {
  name: 'App', components: {
    Router, Snackbar, Overlay,
  },
  
  mounted: function() {
    // error handling
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
    
    // add to home screen popoup
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      let installPromptEvent = e;
      
      Store.dispatch('global/displayOverlay', {
        type: overlayTypes.none,
        display: true,
        text: 'Thank you for using Mux',
        caption: 'To give you the best experience, we recommend that you add' +
        ' Mux to your home screen.',
        image: '/static/logos/android-chrome-144x144.png',
        closeable: true,
        buttons: [
          {
            type: 'primary',
            text: 'Add to home screen',
            icon: 'add',
            onClick: () => {
              Store.dispatch('global/displayOverlay', {display: false}).
                catch(console.error);
              installPromptEvent.prompt();
            },
          }],
      }).catch(console.error);
    });
    
    // service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ServiceWorker.js', {scope: '/'}).
        then((swr) => Store.commit('global/serviceWorker', swr)).
        catch(console.error);
    }
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
