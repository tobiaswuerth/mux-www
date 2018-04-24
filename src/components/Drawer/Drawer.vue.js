import {paths} from '../../ecosystems/vue-router/Router';
import Store from './../../ecosystems/vuex/Store';

export default {
  name: 'LayoutDrawer',
  
  data: () => ({
    routes: paths, canInvite: false,
  }),
  
  mounted: function() {
    Store.dispatch('auth/getToken').then((token) => {
      if (!token) {
        console.log('false');
        return false;
      }
      let parts = token.split('.');
      if (parts.length < 3) {
        console.log('false');
        return false;
      }
      let sJsonClaims = atob(parts[1]);
      let claims = JSON.parse(sJsonClaims);
      console.log(claims.CanInvite);
      this.canInvite = claims.CanInvite;
    }).catch(console.error);
  },
};
