<template>
  <div class="full-width full-height">
    <Toolbar/>
    <Drawer/>
    <FloatingActionButton/>
  </div>
</template>

<script>
  import Drawer from '../components/Drawer';
  import Toolbar from '../components/Toolbar';
  import FloatingActionButton from '../components/FloatingActionButton';

  export default {
    name: 'AuthenticatedPage', components: {
      Drawer, Toolbar, FloatingActionButton
    },
  };
</script>
