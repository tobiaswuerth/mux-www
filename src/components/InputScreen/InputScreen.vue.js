export default {
  name: 'InputScreen',
  
  props: {
    data: {},
  },
  
  methods: {
    getStyle: function(btn) {
      return `md-raised md-${btn.type}`;
    },
  },
};
