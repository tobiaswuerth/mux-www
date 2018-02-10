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
    onSuccess: {},
    dataSource: {},
    hideEmptyState: {}
  },
  
  data: () => {
    return {
      rawData: [],
    };
  },
  
  watch: {
    dataSource: function(v) {
      this.handleResponse(v);
    },
  },
  
  methods: {
    handleResponse: function(v) {
      if (this.postProcessor) {
        this.rawData = this.rawData.concat(v.data);
        this.data = this.postProcessor(this.rawData);
      } else {
        this.data = this.data.concat(v.data);
      }
      
      this.hasMore = v.hasMore;
      if (this.onSuccess) {
        this.onSuccess(this);
      }
    },
    
    load: function() {
      // validate
      if (this.dataSource || this.state === this.states.loading ||
        !this.hasMore) {
        return;
      }
      
      // execute
      this.state = this.states.loading;
      let payload = this.payload || {};
      payload.pageIndex = this.pageIndex;
      this.$store.dispatch(this.route.toString(), payload).
        then(v => {
          this.handleResponse(v);
          if (this.hasMore && this.doPreload) {
            this.state = this.states.ready;
            this.loadMore();
          }
        }).catch(v => {
        console.error(v);
      }).finally(() => {
        this.state = this.states.ready;
      });
    },
  },
});
