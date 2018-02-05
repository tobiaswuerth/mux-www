<template>
  <md-content class="full-width full-height
  md-layout md-alignment-center-center">
    <div class="md-layout-item md-xsmall-size-90
    md-small-size-50 md-medium-size-40 md-size-30 md-large-size-20">
      <LoginForm @login='onLogin'/>
    </div>
  </md-content>

</template>

<script>

  import LoginForm from './../components/LoginForm';

  export default {
    name: 'LoginPage',

    components: {
      LoginForm,
    },

    methods: {
      onLogin: function(credentials) {
        // todo show error message on failed login
        this.$store.dispatch('auth/login', credentials).then(v => {
          // successful request
        }).catch(v => {
          // todo request not successful
        });
      },
    },
  };

</script>
