export default {
  name: 'snackbar',
  
  data: () => ({
    isInfinite: false, message: '', showSnackbar: false, duration: 3000,
  }),
  
  props: {
    data: {},
  },
  
  methods: {
    hide: function() {
      this.showSnackbar = false;
    },
  },
  
  watch: {
    data: function(v) {
      this.message = v.message || '';
      this.duration = v.duration || 3500;
      this.isInfinite = v.isInfinite || false;
      this.showSnackbar = true;
    },
  },
};
