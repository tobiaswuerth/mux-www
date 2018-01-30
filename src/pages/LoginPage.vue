<template id="login-page">
  <LoginForm></LoginForm>
</template>

<script>

import LoginForm from './../components/LoginForm'

export default {
  name: 'LoginPage',
  components: { LoginForm }
}

</script>

<style scoped>
#login-page {
  width: 100vw;
  height: 100vh;
}
</style>
