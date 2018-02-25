import Vue from 'vue';
import {isIterable} from './../../scripts/Utils';

export default Vue.extend({
  name: 'DataLoaderWrapper',
  
  props: {
    dataLoader: {}, hideEmptyState: {},
  },
  
  computed: {
    showEmptyState: function() {
      if (this.hideEmptyState) {
        return false;
      }
      if (!this.dataLoader) {
        return true;
      }
      if (this.dataLoader.isLoading || this.dataLoader.hasMore()) {
        return false;
      }
      if (!this.dataLoader.dataSource) {
        return true;
      }
      return !this.dataLoader.dataSource.data ||
        isIterable(this.dataLoader.dataSource.data) &&
        this.dataLoader.dataSource.isEmpty() ||
        !isIterable(this.dataLoader.dataSource.data) &&
        Object.keys(this.dataLoader.dataSource.data).length === 0;
    },
    
    showUpperSpinner: function() {
      return !this.dataLoader || !this.dataLoader.dataSource
        ? true
        : this.dataLoader.isLoading;
    },
    
    showBottomSpinner: function() {
      return !this.dataLoader || !this.dataLoader.dataSource ||
      this.dataLoader.dataSource.isEmpty()
        ? false
        : this.dataLoader.isLoading && this.dataLoader.dataSource.data.length >
        0;
    },
  },
});
