import {routes} from './../ecosystems/vue-router/Router';

let i = 0;
const states = {
  ready: 1 << i++, loading: 1 << i++,
};

export default {
  
  data: () => ({
    pageIndex: 0, states, state: states.ready, routes, hasMore: true, data: [],
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
  },
  
};

