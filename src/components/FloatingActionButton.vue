<template>
  <md-speed-dial class="md-bottom-right hide-on-large" md-direction="top"
                 md-event="click">
    <md-speed-dial-target class="md-primary">
      <md-icon class="md-morph-initial">group_work</md-icon>
      <md-icon class="md-morph-final">album</md-icon>
    </md-speed-dial-target>

    <md-speed-dial-content>
      <md-button class="md-icon-button">
        <md-icon>view_headline</md-icon>
        <md-tooltip md-direction="left">Tracks</md-tooltip>
      </md-button>

      <md-button class="md-icon-button">
        <md-icon>view_list</md-icon>
        <md-tooltip md-direction="left">Records</md-tooltip>
      </md-button>

      <md-button class="md-icon-button">
        <md-icon>view_agenda</md-icon>
        <md-tooltip md-direction="left">Releases</md-tooltip>
      </md-button>

      <md-button class="md-icon-button">
        <md-icon>people</md-icon>
        <md-tooltip md-direction="left">Artists</md-tooltip>
      </md-button>
    </md-speed-dial-content>
  </md-speed-dial>
</template>

<script>
  export default {
    name: 'FloatingActionButton',
  };
</script>

<style scoped>
  @media (min-width: 960px) {
    .hide-on-large {
      display: none !important;
    }
  }
</style>
