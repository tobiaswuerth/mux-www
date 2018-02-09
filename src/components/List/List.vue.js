import Repeater from './../DataRepeater/DataRepeater';

export default {
  name: 'List',
  
  props: {
    route: {}, valueKey: {}, destination: {}, doPreload: {}, payload: {},
  },
  
  components: {
    Repeater,
  },
};
