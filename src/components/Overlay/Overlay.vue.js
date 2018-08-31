import List from './../List/List';

let i = 0;
export const types = {
  none: 1 << i++, list: 1 << i++, spinner: 1 << i++,
};

export default {
  name: 'Overlay',
  
  components: {
    List,
  },
  
  props: {
    data: {},
  },
  
  data: () => {
    return {
      types,
    };
  },
  
  methods: {
    getStyle: function(btn) {
      return btn.type ? `md-${btn.type}` : '';
    },
  
    close: function() {
      this.data.display = false;
    },
  },
};
