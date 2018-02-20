import Repeater from '../Repeater/Repeater';
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
    doInsetDivider: {},
    valueKey: {},
    textKey: {},
    
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
  
  computed: {
    cDataLoader: function() {
      return this.dataLoader;
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
    Repeater,
  },
};
