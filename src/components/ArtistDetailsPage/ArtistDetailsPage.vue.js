import Vue from 'vue';
import Router, {routes} from './../../ecosystems/vue-router/Router';

import ListBase from './../../mixins/ListBase';

export default Vue.extend({
  name: 'ArtistDetailsPage',

  components: {
    Router,
  },

  mixins: [ListBase],

  props: {
    id: {},
  },

  computed: {
    getReleasesById: function() {
      return routes.private.artists.releases.replace(':id', this.id);
    },

    getRecordsById: function() {
      return routes.private.artists.records.replace(':id', this.id);
    },
  },

  methods: {

    load: function() {
      this.state = this.states.loading;

      this.$store.dispatch('artists/byId', {id: this.id}).
        then(v => {
          this.data = v.data;
        }).finally(() => {
        this.state = this.states.ready;
      });
    },
  },
});
