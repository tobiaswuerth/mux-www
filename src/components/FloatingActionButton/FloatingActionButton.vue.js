import {paths} from '../../ecosystems/vue-router/Router';
import Store from './../../ecosystems/vuex/Store';

export default {
  name: 'FloatingActionButton',
  
  data: () => {
    return {
      routes: paths, canInvite: false,
    };
  },
  
  mounted: function() {
    Store.dispatch('auth/getClaims').
      then(c => this.canInvite = c.CanInvite).
      catch(console.error);
  },
};
