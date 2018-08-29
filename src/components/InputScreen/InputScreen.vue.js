import List from './../List/List';

let i = 0;
export const inputTypes = {
  buttonChoice: 1 << i++, list: 1 << i++,
};

export default {
  name: 'InputScreen',
  
  components: {
    List,
  },
  
  props: {
    data: {},
  },
  
  data: () => {
    return {
      inputTypes,
    };
  },
  
  methods: {
    getStyle: function(btn) {
      return btn.type ? `md-raised md-${btn.type}` : 'md-raised';
    },
  },
};
