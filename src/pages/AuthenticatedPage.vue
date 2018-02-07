<template>
  <div class="md-layout-column">

    <md-app class="page-content" md-mode="fixed">

      <md-app-toolbar class="clean">
        <my-toolbar/>
      </md-app-toolbar>

      <md-app-drawer md-active.sync="true" md-fixed md-permanent="clipped"
                     class="md-xsmall-hide md-small-hide drawer">
        <my-drawer/>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
        <my-fab/>
      </md-app-content>

    </md-app>

    <my-footer class="footer md-elevation-13"/>

  </div>
</template>

<script>
  import Router from './../Router';
  import Drawer from './../components/Drawer';
  import Toolbar from './../components/Toolbar';
  import Footer from './../components/Footer';
  import FloatingActionButton from './../components/FloatingActionButton';

  export default {
    name: 'AuthenticatedPage', components: {
      Router,
      'my-drawer': Drawer,
      'my-toolbar': Toolbar,
      'my-fab': FloatingActionButton,
      'my-footer': Footer,
    },
  };
</script>

<style scoped>
  .page-content {
    height: calc(100vh - 80px);
  }

  .clean {
    padding: 0;
  }

  .footer {
    bottom: 0;
    height: 80px;
    position: absolute;
    width: 100vw;
  }

  .drawer {
    width: 20%;
    min-width: 250px;
  }
</style>
