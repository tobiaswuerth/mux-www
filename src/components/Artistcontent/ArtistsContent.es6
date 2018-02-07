let i = 0;
const states = {
  ready: 1 << i++, loading: 1 << i++,
};

export default {
  name: 'ArtistsContent',

  data: () => ({
    pageIndex: 0, states, state: states.ready,
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

    load: function() {
      // validate
      if (this.state === this.states.loading) {
        return;
      }

      // execute
      this.state = this.states.loading;
      this.$store.dispatch('artists/all', {pageIndex: this.pageIndex}).
        then(v => {
          // successful request
        }).
        catch(v => {
          console.error(v);
        }).finally(() => {
        this.state = this.states.ready;
      });

    },
  },
};
