import Vue from 'vue';

import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'Repeater',
  
  mixins: [AsyncDataLoader],
  
  props: {
    route: {},
    valueKey: {},
    destination: {},
    doPreload: {},
    payload: {},
    postProcessor: {},
  },
  
  data: () => {
    return {
      rawData: [],
    };
  },
  
  methods: {
    load: function() {
      // validate
      if (this.state === this.states.loading || !this.hasMore) {
        return;
      }
      
      // execute
      this.state = this.states.loading;
      let payload = this.payload || {};
      payload.pageIndex = this.pageIndex;
      this.$store.dispatch(this.route.toString(), payload).
        then(v => {
          if (this.postProcessor) {
            this.rawData = this.rawData.concat(v.data);
            this.data = this.postProcessor(this.rawData);
          } else {
            this.data = this.data.concat(v.data);
          }
          this.hasMore = v.hasMore;
        }).catch(v => {
        console.error(v);
        this.doPreload = false; // force stop loading data
      }).finally(() => {
        this.state = this.states.ready;
        if (this.hasMore && this.doPreload) {
          this.loadMore();
        }
      });
    },
  },
});
