import {paths} from '../../ecosystems/vue-router/Router';
import Store from './../../ecosystems/vuex/Store';

export default {
  name: 'LayoutDrawer',
  
  data: () => ({
    routes: paths,
  }),
  
  computed: {
    userCanInvite: async function() {
      let token = await Store.dispatch('auth/getToken').catch(console.error);
      if (!token) {
        return false;
      }
      let parts = token.split('.');
      if (parts.length < 3) {
        return false;
      }
      let sJsonClaims = atob(parts[1]);
      let claims = JSON.parse(sJsonClaims);
      return claims.CanInvite;
    },
  },
};
