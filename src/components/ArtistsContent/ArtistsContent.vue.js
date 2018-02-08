import {routes} from './../../ecosystems/vue-router/Router';

let i = 0;
const states = {
  ready: 1 << i++, loading: 1 << i++,
};

export default {
  name: 'ArtistsContent',

  data: () => ({
    pageIndex: 0, states, state: states.ready, data: [], routes, hasMore: true,
  }),

  mounted: function() {
    this.load();
  },

  computed: {
    isLoading: function() {
      return this.state === this.states.loading;
    },
  },

  methods: {

    loadMore: function() {
      this.pageIndex++;
      this.load();
    },

    getArtistByNameUri: function(name) {
      return `${this.routes.private.artists}/${encodeURIComponent(name)}`;
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
};
