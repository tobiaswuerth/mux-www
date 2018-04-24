import Store from './../../ecosystems/vuex/Store';
import Router, {paths} from './../../ecosystems/vue-router/Router';

let i = 0;
const states = {
  loading: 1 << i++, ready: 1 << i++,
};

export default {
  name: 'RegisterPage',
  
  props: {
    token: {},
  },
  
  data: () => ({
    credentials: {
      username: null, password: null, password2: null,
    }, state: states.ready, validation: {
      isUsernameValid: true, isPasswordValid: true, isPassword2Valid: true,
    },
  }),
  
  methods: {
    onEnter: function() {
      if (!this.isExecutingRegister) {
        this.onBtnRegisterClicked();
      }
    },
    
    onBtnRegisterClicked: async function() {
      this.state = states.loading;
      
      // check
      this.updateValidationUsername();
      this.updateValidationPassword();
      this.updateValidationPassword2();
      
      if (!this.validation.isUsernameValid ||
        !this.validation.isPasswordValid || !this.validation.isPassword2Valid) {
        this.state = states.ready;
        return Promise.reject('one or more inputs are invalid. aborting.');
      }
      
      let creds = {
        token: this.token,
        username: this.credentials.username,
        password: btoa(this.credentials.password),
      };
      
      await Store.dispatch('invites/use', creds).then(v => {
        // successful login
        Store.dispatch('global/hint', 'Register successful.').then(() => {
          Router.push(paths.public.login);
        }).catch(console.error);
        this.state = states.ready;
        return Promise.resolve();
      }).catch(v => {
        // login failed
        Store.dispatch('global/hint', `Register failed. ${v}`).
          catch(console.error);
        this.state = states.ready;
        return Promise.reject(v);
      });
    },
    
    updateValidationUsername: function() {
      this.validation.isUsernameValid = this.isUsernameValid;
    }, updateValidationPassword: function() {
      this.validation.isPasswordValid = this.isPasswordValid;
    }, updateValidationPassword2: function() {
      this.validation.isPassword2Valid = this.isPassword2Valid;
    },
  },
  
  watch: {
    'credentials.username': function() {
      this.updateValidationUsername();
    }, 'credentials.password': function() {
      this.updateValidationPassword();
    }, 'credentials.password2': function() {
      this.updateValidationPassword2();
    },
  },
  
  computed: {
    isUsernameValid: function() {
      return !!this.credentials.username;
    }, isPasswordValid: function() {
      let password = this.credentials.password;
      return !!password && password.length > 7 && password.match(/[0-9]/gi) &&
        password.match(/[a-zA-Z]/gi) && password.match(/[^0-9a-zA-Z]/gi);
    }, isPassword2Valid: function() {
      return this.isPasswordValid && this.credentials.password ===
        this.credentials.password2;
    }, isExecutingRegister: function() {
      return this.state === states.loading;
    },
  },
};
