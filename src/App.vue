<template>
  <div id="app" class="md-app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
  #app {
    min-height: 100vh;
    min-width: 100vw;
  }
</style>
