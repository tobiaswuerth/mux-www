<template>
  <div id="app" class="page-container">
    <router-view/>
  </div>
</template>

<script>
  import Router from './../Router';

  export default {
    name: 'App', components: {
      Router,
    },
  };
</script>

<style>
  .full-height {
    height: 100vh;
  }

  .full-width {
    width: 100vw;
  }
</style>
