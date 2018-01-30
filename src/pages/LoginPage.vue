<template>

  <div class="md-layout md-alignment-center-center" id="login-page">
    <div class="md-layout-item md-xsmall-size-90 md-small-size-50 md-medium-size-40 md-size-30 md-large-size-20">
      <LoginForm></LoginForm>
    </div>
  </div>

</template>

<script>

import LoginForm from './../components/LoginForm'

export default {
  name: 'LoginPage',
  components: {LoginForm}
}

</script>

<style scoped>
  #login-page {
    width: 100vw;
    height: 100vh;
  }
</style>
