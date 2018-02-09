import Vue from 'vue';

import ListBase from './../../mixins/ListBase';

export default Vue.extend({
  name: 'RecordsList',

  mixins: [ListBase],

  props: {
    artistId: {},
  },

  methods: {
    load: function() {

    },
  },
});
