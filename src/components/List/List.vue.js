import DataLoaderWrapper from '../DataLoaderWrapper/DataLoaderWrapper';
import DataLoader from '../../scripts/DataLoader';
import {isCallable, isIterable} from './../../scripts/Utils';

export default {
  name: 'List',
  
  props: {
    // data loader
    route: {},
    payload: {},
    doPreload: {}, onAfter: {},
    
    // ui
    onClick: {},
    hideEmptyState: {},
    showAvatar: {},
    doInsetDivider: {},
    toString1: {},
    toString2: {},
    toString3: {},
    actionsLeft: {},
    actionsRight: {},
    
    // url Router params
    id: {},
    name: {},
    generic1: {},
  },
  
  data: () => {
    return {
      dataLoader: null,
    };
  },
  
  methods: {
    getString1: function(item) {
      return this.getString(this.toString1, item);
    },
    
    getString2: function(item) {
      return this.getString(this.toString2, item);
    },
    
    getString3: function(item) {
      return this.getString(this.toString3, item);
    },
    
    getString: function(key, item) {
      return isCallable(key) ? key.call(this, item) : item[key];
    },
    
    getAvatar: function(item) {
      let s = this.getString1(item);
      return s ? s.substr(0, 2) : s;
    },
    
    load: function() {
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
        this.dataLoader.reset();
        action.call(this.dataLoader, payloads, {doPreload: this.doPreload});
      }).catch(console.error);
    },
    
    getActionStyle: function(action) {
      let actionStyle = 'md-primary';
      
      if (action.isRound) {
        actionStyle += ' md-icon-button';
      }
      if (action.isRaised) {
        actionStyle += ' md-raised';
      }
      
      return actionStyle;
    },
    
    performAction: function(action, item, event) {
      if (isCallable(action.onClick)) {
        event.stopPropagation();
        action.onClick.call(this, item);
      }
    },
  },
  
  watch: {
    '$route': function() {
      this.load();
    },
  },
  
  mounted: function() {
    this.dataLoader = new DataLoader(this.route, this);
    this.dataLoader.onAfter = this.onAfter;
    
    this.load();
  },
  
  components: {
    DataLoaderWrapper,
  },
};
