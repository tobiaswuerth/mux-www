<template id="login-form">
  <md-content>
    <md-card>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Mux - Login</div>
          <div class="md-subhead">Welcome!</div>
        </md-card-header-text>
        <md-card-media>
          <img src="./../assets/logo-128-transparent.png" alt="Logo">
        </md-card-media>
      </md-card-header>

      <md-card-content>
        <md-field :class="{'md-invalid': !this.validation.isUsernameValid}">
          <md-icon>account_circle</md-icon>
          <label>Username</label>
          <md-input v-model.trim="credentials.username" @keyup.enter="onEnter"/>
          <span class="md-error">This field is required</span>
        </md-field>
        <md-field :class="{'md-invalid': !this.validation.isPasswordValid}">
          <md-icon>lock</md-icon>
          <label>Password</label>
          <md-input v-model="credentials.password" type="password"
                    @keyup.enter="onEnter"/>
          <span class="md-error">This field is required</span>
        </md-field>
      </md-card-content>

      <md-card-actions>
        <md-button @click.prevent="onBtnLoginClicked"
                   class="md-raised md-primary"
                   :disabled="isExecutingLogin">
          <span v-if="!isExecutingLogin">
            Login
          </span>
          <span v-else-if="isExecutingLogin">
            <md-progress-spinner id="spinner" :md-diameter="20" :md-stroke="3"
                                 md-mode="indeterminate"/>
          </span>
        </md-button>
      </md-card-actions>
    </md-card>
  </md-content>

</template>

<script>
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
          console.log('one or more inputs are invalid. aborting.');
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
</script>

<style scoped>
  #spinner {
    margin: 5px;
  }
</style>
