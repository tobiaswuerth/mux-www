import LoginForm from '../LoginForm/LoginForm.vue';
import Store from './../../ecosystems/vuex/Store';

export default {
  name: 'LoginPage',
  
  components: {
    LoginForm,
  },
  
  methods: {
    onLogin: function(credentials) {
      this.$store.dispatch('auth/login', credentials).
        then(() => Store.dispatch('global/hint', 'Successful login').
          catch(console.error)).
        catch(() => Store.dispatch('global/hint', 'Login failed').
          catch(console.error));
    },
  },
};
