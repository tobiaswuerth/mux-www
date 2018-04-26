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
    Store.dispatch('auth/getToken').then((token) => {
      if (!token) {
        return false;
      }
      let parts = token.split('.');
      if (parts.length < 3) {
        return false;
      }
      let sJsonClaims = atob(parts[1]);
      let claims = JSON.parse(sJsonClaims);
      
      this.canInvite = claims.CanInvite;
    }).catch(console.error);
  },
};
