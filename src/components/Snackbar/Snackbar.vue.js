export default {
  name: 'snackbar',
  
  data: () => ({
    isInfinite: false, message: '', showSnackbar: false, duration: 3000,
  }),
  
  methods: {
    show: function(message, duration = 3000, isInfinite = false) {
      this.message = message;
      this.duration = duration;
      this.isInfinite = isInfinite;
      this.showSnackbar = true;
    },
  },
};
