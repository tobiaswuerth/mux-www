export default {
  name: 'snackbar',
  
  data: () => ({
    isInfinite: false, message: '', showSnackbar: false, duration: 3000,
  }),
  
  props: {
    data: {},
  },
  
  watch: {
    data: function(v) {
      this.message = v.message || '';
      this.duration = v.duration || 2000;
      this.isInfinite = v.isInfinite || false;
      this.showSnackbar = true;
    },
  },
};
