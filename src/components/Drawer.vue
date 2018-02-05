<template>
  <md-drawer md-permanent="clipped" class="full-height md-xsmall-hide md-small-hide">
    <md-list>
      <md-list-item to="/">
        <md-icon>view_headline</md-icon>
        <span class="md-list-item-text">Tracks</span>
      </md-list-item>

      <md-list-item to="/">
        <md-icon>view_list</md-icon>
        <span class="md-list-item-text">Records</span>
      </md-list-item>

      <md-list-item to="/">
        <md-icon>view_agenda</md-icon>
        <span class="md-list-item-text">Releases</span>
      </md-list-item>

      <md-list-item to="/">
        <md-icon>people</md-icon>
        <span class="md-list-item-text">Artists</span>
      </md-list-item>
    </md-list>
  </md-drawer>
</template>

<script>
  export default {
    name: 'Drawer',
  };
</script>

<style scoped>

</style>
