export default {
  name: 'LoginForm',
  
  data: () => ({
    credentials: {
      username: '', password: '',
    }, validation: {
      isUsernameValid: true, isPasswordValid: true,
    },
  }),
  
  methods: {
    onEnter: function() {
      if (!this.isExecutingLogin) {
        this.onBtnLoginClicked();
      }
    }, onBtnLoginClicked: function() {
      // refresh
      this.updateValidationUsername();
      this.updateValidationPassword();
      
      // check
      if (!this.validation.isUsernameValid ||
        !this.validation.isPasswordValid) {
        console.error('one or more inputs are invalid. aborting.');
        return;
      }
      
      // emit
      this.$emit('login', {
        username: this.credentials.username,
        password: this.credentials.password,
      });
    }, updateValidationUsername: function() {
      this.validation.isUsernameValid = this.isUsernameValid;
    }, updateValidationPassword: function() {
      this.validation.isPasswordValid = this.isPasswordValid;
    },
  },
  
  watch: {
    'credentials.username': function() {
      this.updateValidationUsername();
    }, 'credentials.password': function() {
      this.updateValidationPassword();
    },
  },
  
  computed: {
    isUsernameValid: function() {
      return !!this.credentials.username;
    }, isPasswordValid: function() {
      return !!this.credentials.password;
    }, isExecutingLogin: function() {
      return this.$store.getters['auth/loginStates'].LOGIN_EXECUTING ===
        this.$store.getters['auth/loginState'].state;
    },
  },
};
