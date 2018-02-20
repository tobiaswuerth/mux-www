import Vue from 'vue';
import {isIterable} from './../../scripts/Utils';

export default Vue.extend({
  name: 'Repeater',
  
  props: {
    dataLoader: {}, hideEmptyState: {},
  },
  
  computed: {
    showEmptyState: function() {
      if (this.hideEmptyState) {
        return false;
      }
      let loader = this.dataLoader;
      if (!loader) {
        return true;
      }
      if (loader.isLoading || loader.hasMore()) {
        return false;
      }
      let source = loader.dataSource;
      if (!source) {
        return true;
      }
      
      let data = source.data;
      return !data || isIterable(data) && source.isEmpty() ||
        !isIterable(data) && Object.keys(data).length === 0;
      
    }, showUpperSpinner: function() {
      let loader = this.dataLoader;
      if (!loader) {
        return true;
      }
      let source = loader.dataSource;
      if (!source && loader.isLoading) {
        return false; // already bottom spinner visible
      }
      if (!source) {
        return true;
      }
      if (source.isEmpty()) {
        return false; // already bottom spinner visible
      }
    },
  },
  
  methods: {
    loadMore: function() {
      // this method is needed because direct binding doesn't work if
      // dataLoader is replaced
      this.dataLoader.loadMore().then(() => {
        // ignore
      }).catch((r) => {
        console.error(r);
      });
    },
  },
  
});
