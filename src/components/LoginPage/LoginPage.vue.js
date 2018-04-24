import Store from './../../ecosystems/vuex/Store';
import Router from './../../ecosystems/vue-router/Router';
import {clone} from './../../scripts/DataUtils';

let i = 0;
const states = {
  loading: 1 << i++, ready: 1 << i++,
};

export default {
  name: 'LoginPage',
  
  data: () => ({
    credentials: {
      username: null, password: null,
    }, state: states.ready, validation: {
      isUsernameValid: true, isPasswordValid: true,
    },
  }),
  
  methods: {
    onEnter: function() {
      if (!this.isExecutingLogin) {
        this.onBtnLoginClicked();
      }
    },
    
    onBtnLoginClicked: async function() {
      this.state = states.loading;
      
      // check
      this.updateValidationUsername();
      this.updateValidationPassword();
      if (!this.validation.isUsernameValid ||
        !this.validation.isPasswordValid) {
        this.state = states.ready;
        return Promise.reject('one or more inputs are invalid. aborting.');
      }
  
      let creds = clone(this.credentials);
      creds.password = btoa(creds.password);
  
      await Store.dispatch('repo/login', creds).then(v => {
        // successful login
        Store.dispatch('auth/updateAuthentication', v.data.token).then(() => {
          Store.dispatch('global/hint', 'Login successful.').then(() => {
            Router.push('/');
          }).catch(console.error);
        }).catch(console.error);
        
        this.state = states.ready;
        return Promise.resolve();
      }).catch(v => {
        // login failed
        Store.dispatch('global/hint', `Login failed. ${v}`).
          catch(console.error);
        this.state = states.ready;
        return Promise.reject(v);
      });
    },
    
    updateValidationUsername: function() {
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
      return this.state === states.loading;
    },
  },
};
