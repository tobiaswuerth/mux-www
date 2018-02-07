<template>
  <div class="clean">
    <md-list-item :to='routes.private.tracks'>
      <md-icon>view_headline</md-icon>
      <span class="md-list-item-text">Tracks</span>
    </md-list-item>

    <md-list-item :to='routes.private.records'>
      <md-icon>view_list</md-icon>
      <span class="md-list-item-text">Records</span>
    </md-list-item>

    <md-list-item :to='routes.private.releases'>
      <md-icon>view_agenda</md-icon>
      <span class="md-list-item-text">Releases</span>
    </md-list-item>

    <md-list-item :to='routes.private.artists'>
      <md-icon>people</md-icon>
      <span class="md-list-item-text">Artists</span>
    </md-list-item>
  </div>
</template>

<script>
  import {routes} from './../Router';

  export default {
    name: 'Drawer',

    data: () => ({
      routes,
    }),
  };
</script>

<style scoped>
  .clean {
    list-style: none;
  }
</style>
