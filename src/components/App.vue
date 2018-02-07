<template>
  <div class="page-container">
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

<style lang="scss">
  //@import '~roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss'; // todo
</style>
