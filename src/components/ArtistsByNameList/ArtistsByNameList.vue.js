import Vue from 'vue';
import {routes} from './../../ecosystems/vue-router/Router';

import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'ArtistsByNameList',

  mixins: [AsyncDataLoader],

  methods: {

    getUriById: function(id) {
      return routes.private.artists.details.replace(':id', id);
    },

    load: function() {
      // validate
      if (this.state === this.states.loading) {
        return;
      }

      // execute
      this.state = this.states.loading;
      this.$store.dispatch('artists/byName', {
        name: this.name, pageIndex: this.pageIndex,
      }).then(v => {
        this.data = v.data;
        this.hasMore = v.hasMore;
      }).catch(v => {
        console.error(v);
      }).finally(() => {
        this.state = this.states.ready;
      });
    },
  },

  props: {
    name: {},
  },
});
