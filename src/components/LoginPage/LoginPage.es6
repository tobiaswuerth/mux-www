import LoginForm from '../LoginForm/LoginForm';

export default {
  name: 'LoginPage',

  components: {
    LoginForm,
  },

  methods: {
    onLogin: function(credentials) {
      this.$store.dispatch('auth/login', credentials).then(v => {
        // successful request
      }).catch(v => {
        // todo show error message on failed login
        console.error(v);
      });
    },
  },
};
