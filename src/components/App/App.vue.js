import Router from '../../ecosystems/vue-router/Router';
import Snackbar from '../Snackbar/Snackbar';
import Store from './../../ecosystems/vuex/Store';
import LoadingScreen from './../LoadingScreen/LoadingScreen';

export default {
  name: 'App', components: {
    Router, Snackbar, LoadingScreen,
  },
  
  mounted: function() {
    // todo remove after some time
    // this is needed for proper migration to cookie storage
    localStorage.clear();
    
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      let string = (msg || '').toLowerCase();
      let substring = 'script error';
      if (string.indexOf(substring) > -1) {
        Store.dispatch('global/hint',
          'Script Error: See Browser Console for Detail').catch(console.error);
        return false;
      }
      
      let message = [
        'Message: ' + msg, 'URL: ' + url, 'Line: ' + lineNo,
        'Column: ' + columnNo, 'Error object: ' + JSON.stringify(error)].join(
        ' - ');
      Store.dispatch('global/hint', message).catch(console.error);
      return false;
    };
  },
  
  computed: {
    dataSnackbar: function() {
      return Store.getters['global/hints'];
    },
  
    loadingScreenData: function() {
      return Store.getters['global/loadingScreenData'];
    },
  },
};
