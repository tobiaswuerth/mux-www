import ReleaseCard from './../ReleaseCard/ReleaseCard';
import DataLoaderWrapper from '../DataLoaderWrapper/DataLoaderWrapper';
import DataLoader from './../../scripts/DataLoader';
import {isCallable, isIterable} from './../../scripts/Utils';

export default {
  name: 'ReleasesListDetailed',
  
  components: {
    DataLoaderWrapper, ReleaseCard,
  },
  
  data: () => {
    return {
      dataLoader: null,
    };
  },
  
  methods: {
    async initLoader() {
      this.dataLoader = new DataLoader(this.route, this);
      this.dataLoader.onAfter = this.onAfter;
      
      // prepare payload
      let loadPayload = this.payload
        ? isCallable(this.payload)
          ? this.payload.call(this, this.$route.params)
          : Promise.resolve(this.payload)
        : Promise.resolve({});
      let payloads = await loadPayload.catch((r) => {
        console.error(r);
      });
      
      // prepare action
      let action = isIterable(payloads)
        ? this.dataLoader.loadAll
        : this.dataLoader.load;
      
      // execute action
      await action.call(this.dataLoader, payloads, {doPreload: this.doPreload}).
        catch((r) => {
          console.error(r);
        });
      
      return Promise.resolve(this.dataLoader);
    },
  },
  
  props: {
    name: {}, payload: {}, route: {}, onAfter: {}, doPreload: {},
  },
};
