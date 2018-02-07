<template>
  <div class="clean">
    <md-toolbar class="md-transparent" md-elevation="0">
      Navigation
    </md-toolbar>

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

<script src="./Drawer.es6"></script>

<style scoped>
  @import './Drawer.css';
</style>
