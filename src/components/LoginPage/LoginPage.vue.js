import LoginForm from '../LoginForm/LoginForm.vue';
import Snackbar from '../Snackbar/Snackbar';

export default {
  name: 'LoginPage',
  
  components: {
    LoginForm, Snackbar,
  },
  
  data: () => {
    return {
      hints: {},
    };
  },
  
  methods: {
    onLogin: function(credentials) {
      this.$store.dispatch('auth/login', credentials).then(v => {
        // successful request
        this.hints = {
          message: 'Successful login',
        };
      }).catch(v => {
        if (v.response.status === 401) {
          this.hints = {
            message: 'Invalid username/password combination',
          };
        } else {
          this.hints = {
            message: v.message || v,
          };
        }
      });
    },
  },
};
