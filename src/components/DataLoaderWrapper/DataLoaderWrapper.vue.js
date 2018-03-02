import Vue from 'vue';
import {isIterable} from './../../scripts/Utils';
import DataLoader from './../../scripts/DataLoader';

export default Vue.extend({
  name: 'DataLoaderWrapper',
  
  data: () => {
    return {
      async: true, loader: new DataLoader(null, this),
    };
  },
  
  props: {
    dataLoader: {}, hideEmptyState: {},
  },
  
  mounted: function() {
    let self = this;
    Promise.resolve(this.dataLoader).then(function(v) {
      self.loader = v;
      self.async = false;
    });
  },
  
  computed: {
    showEmptyState: function() {
      if (this.hideEmptyState) {
        return false;
      }
      if (!this.loader) {
        return true;
      }
      if (this.loader.isLoading || this.loader.hasMore()) {
        return false;
      }
      if (!this.loader.dataSource) {
        return true;
      }
      return !this.loader.dataSource.data ||
        isIterable(this.loader.dataSource.data) &&
        this.loader.dataSource.isEmpty() ||
        !isIterable(this.loader.dataSource.data) &&
        Object.keys(this.loader.dataSource.data).length === 0;
    },
    
    showUpperSpinner: function() {
      return !this.loader || !this.loader.dataSource
        ? true
        : this.loader.isLoading;
    },
    
    showBottomSpinner: function() {
      return !this.loader || !this.loader.dataSource ||
      this.loader.dataSource.isEmpty() ? false : this.loader.isLoading &&
        this.loader.dataSource.data.length > 0;
    },
  },
});
