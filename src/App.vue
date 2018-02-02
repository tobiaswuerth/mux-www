<template>
  <div id="app" class="md-app">
    <router-view/>
  </div>
</template>

<script>
  import Router from './Router';

  export default {
    name: 'App', components: {
      Router,
    },
  };
</script>

<style scoped>
  #app {
    min-height: 100vh;
    min-width: 100vw;
  }
</style>
