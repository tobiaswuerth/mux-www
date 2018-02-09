import Vue from 'vue';

import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'ArtistsList',

  mixins: [AsyncDataLoader],

  methods: {

    getArtistByNameUri: function(name) {
      return this.routes.private.artists.lookup.replace(':name',
        encodeURIComponent(name));
    },

    load: function() {
      // validate
      if (this.state === this.states.loading) {
        return;
      }

      // execute
      this.state = this.states.loading;
      this.$store.dispatch('artists/all', {pageIndex: this.pageIndex}).
        then(v => {
          this.data = this.data.concat(v.data);
          this.hasMore = v.hasMore;
        }).
        catch(v => {
          console.error(v);
        }).finally(() => {
        this.state = this.states.ready;
      });

    },
  },
});
