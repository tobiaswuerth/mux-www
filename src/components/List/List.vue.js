import DataLoaderWrapper from '../DataLoaderWrapper/DataLoaderWrapper';
import {types as overlayTypes} from '../Overlay/Overlay.vue';
import DataLoader from '../../scripts/DataLoader';
import {isCallable, isIterable, isSmallDevice} from './../../scripts/Utils';
import Store from './../../ecosystems/vuex/Store';

export default {
  name: 'List',
  
  props: {
    // data loader
    data: {},
    route: {},
    payload: {},
    doPreload: {},
    onAfter: {},
    
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
    
    clickItem: function(a, i) {
      if (isCallable(this.onClick)) {
        this.onClick(a, i);
      } else if (isSmallDevice()) {
        this.displayHiddenActions(a, i);
      }
    },
    
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
      if (this.data) {
        // no need to load, data already provided
        this.dataLoader.reset();
        this.dataLoader.isLoading = false;
        this.dataLoader.dataSource.data = this.data;
        return;
      }
      
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
      let actionStyle = action.type ? `md-${action.type}` : 'md-primary';
      
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
    
    displayHiddenActions: function(a, i) {
      Store.dispatch('global/displayOverlay', {
        type: overlayTypes.none,
        display: true,
        text: 'Actions',
        closeable: true,
        buttons: this.actionsRight.map((e) => {
          // create proxy with parameter injection for click event
          let action = e.onClick;
          e.onClick = () => action.call(this, a, i);
          return e;
        }),
      }).catch(console.error);
    },
  },
  
  computed: {
    visibleActionsLeft: function() {
      return isSmallDevice() ? (this.actionsLeft
        ? this.actionsLeft
        : []).concat((this.actionsRight
        ? this.actionsRight.filter((i) => i.alwaysVisible)
        : [])) : this.actionsLeft;
    },
    
    visibleActionsRight: function() {
      return isSmallDevice() &&
      (this.actionsRight && this.actionsRight.length > 1)
        ? [
          {
            icon: 'more_vert',
            isRaised: false,
            isRound: true,
            onClick: this.displayHiddenActions,
          }]
        : this.actionsRight;
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
