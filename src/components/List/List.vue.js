import DataLoaderWrapper from '../DataLoaderWrapper/DataLoaderWrapper';
import DataLoader from '../../scripts/DataLoader';
import {isCallable, isIterable} from './../../scripts/Utils';

export default {
  name: 'List',
  
  props: {
    // data loader
    route: {},
    payload: {},
    doPreload: {},
    
    // ui
    onClick: {},
    hideEmptyState: {},
    showAvatar: {},
    doInsetDivider: {},
    valueKey: {},
    toString1: {},
    toString2: {},
    toString3: {},
    
    // manipulation
    onBefore: {},
    onAfter: {},
    
    // url router params
    id: {},
    name: {},
  },
  
  data: () => {
    return {
      dataLoader: null,
    };
  },
  
  methods: {
    getString1: function(item) {
      return this.getString(this.toString1, item);
    }, getString2: function(item) {
      return this.getString(this.toString2, item);
    }, getString3: function(item) {
      return this.getString(this.toString3, item);
    }, getString: function(key, item) {
      return isCallable(key) ? key.call(this, item) : item[key];
    }, getAvatar: function(item) {
      let s = this.getString1(item);
      return s ? s.substr(0, 2) : s;
    },
  },
  
  mounted: function() {
    
    // init
    this.dataLoader = new DataLoader(this.route, this);
    this.dataLoader.onAfter = this.onAfter;
    this.dataLoader.onBefore = this.onBefore;
    
    // prepare payload
    let loadPayload = this.payload
      ? isCallable(this.payload)
        ? this.payload.call(this, this.$route.params)
        : Promise.resolve(this.payload)
      : Promise.resolve({});
    
    loadPayload.then((payloads) => {
      // prepare action
      let action = isIterable(payloads)
        ? this.dataLoader.loadAll
        : this.dataLoader.load;
      
      // execute action
      action.call(this.dataLoader, payloads, this.doPreload).then(() => {
        // ignore
      }).catch((r) => {
        console.error(r);
      });
    }).catch((r) => {
      console.error(r);
    });
  },
  
  components: {
    DataLoaderWrapper,
  },
};
