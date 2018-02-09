import Vue from 'vue'

import AsyncDataLoader from '../../mixins/AsyncDataLoader'

export default Vue.extend({
  name: 'RecordsList',
  
  mixins: [AsyncDataLoader],
  
  props: {
    artistId: {},
  },
  
  methods: {
    load: function () {
      
    },
  },
})
