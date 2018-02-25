import DataSource from './DataSource';
import Store from './../ecosystems/vuex/Store';
import {isCallable, onceOrMore} from './Utils';

function DataLoader(route, parent) {
  this.route = route;
  this.dataSource = new DataSource();
  this.isLoading = true;
  this.onBefore = null;
  this.onAfter = null;
  this.parent = parent;
  
  this._morePayloads = [];
  this._runningRequests = 0;
}

DataLoader.prototype.hasMore = function() {
  return this._morePayloads.length > 0;
};

const updatePayload = (payload) => {
  payload.pageIndex = payload.pageIndex ? payload.pageIndex + 1 : 1;
};

DataLoader.prototype.load = async function(
  payload, doPreload = false, suppressEvent = false) {
  // init
  this.isLoading = true;
  this._runningRequests++;
  if (doPreload) {
    payload.pageSize = 100; // faster preloading
  }
  if (!suppressEvent) {
    onceOrMore(this.onBefore, this);
  }
  
  // execute load
  let scope = this;
  await Store.dispatch(this.route, payload).then(async (v) => {
    scope.dataSource.addAll(v.data);
    
    let result = null;
    
    if (v.hasMore) {
      // load more
      updatePayload(payload);
      if (doPreload) {
        // todo try parallel loading with page guessing
        result = await scope.load(payload, doPreload, true);
      } else {
        scope._morePayloads.push(payload);
      }
    }
    
    // finalize
    if (!suppressEvent) {
      onceOrMore(scope.onAfter, scope);
    }
    if (!result) {
      result = Promise.resolve(scope.dataSource.data);
    }
    
    return result;
  }).catch(r => {
    console.error(r);
    scope._morePayloads.push(payload);
    return Promise.reject(r);
  }).finally(() => {
    scope._runningRequests--;
    scope.isLoading = scope._runningRequests > 0;
  });
};

DataLoader.prototype.loadAll = async function(payloads, doPreload = false) {
  onceOrMore(this.onBefore, this);
  this._runningRequests++;
  await Promise.all(payloads.map(p => this.load(p, doPreload, true))).
    then(() => {
      onceOrMore(this.onAfter, this);
      return Promise.resolve(this.dataSource.data);
    }).
    catch(r => {
      console.error(r);
      return Promise.reject(r);
    }).finally(() => {
      this._runningRequests--;
      this.isLoading = this._runningRequests > 0;
    });
};

DataLoader.prototype.loadMore = async function(doPreload = false) {
  if (this._morePayloads.length === 0) {
    return Promise.resolve();
  }
  
  let promises = [];
  
  while (this._morePayloads.length > 0) {
    let p = this._morePayloads.pop();
    promises.push(this.load(p, doPreload));
  }
  
  await Promise.all(promises).then(() => {
    return Promise.resolve(this.dataSource.data);
  }).catch(r => {
    console.error(r);
    return Promise.reject(r);
  });
};

export default DataLoader;

export const onAfterUnique = (loader) => {
  if (loader.dataSource.data.length > 0) {
    let vk = loader.parent.valueKey;
    let d = loader.dataSource.data.map(x => [x[vk].toString().normalize(), x]);
    d = new Map(d).values();
    d = Array.from(d);
    loader.dataSource.data = d;
  }
};

export const onAfterSingle = (loader) => {
  if (loader.dataSource.data.length > 0) {
    loader.dataSource.data = loader.dataSource.data[0];
  }
};

export const simplyLoad = async (route, payload, filter, map) => {
  let preLoader = new DataLoader(route);
  await preLoader.load(payload, true);
  let relevant = preLoader.dataSource.data.filter(x => filter(x));
  let data = relevant.map(x => map(x));
  return Promise.resolve(data);
};

export const onAfterSort = (loader) => {
  if (loader.dataSource.data.length > 0) {
    let tk = loader.parent.toString1;
    loader.dataSource.data = loader.dataSource.data.sort((a, b) => {
      if (isCallable(tk)) {
        let valA = tk.call(loader, a);
        let valB = tk.call(loader, b);
        return valA > valB ? 1 : -1;
      }
      return a[tk] > b[tk] ? 1 : -1;
    });
  }
};

export const onAfterSelect = (key) => (loader) => {
  if (loader.dataSource.data.length > 0) {
    loader.dataSource.data = loader.dataSource.data.map(x => x[key]);
  }
};

export const onAfterFilter = (condition) => (loader) => {
  if (loader.dataSource.data.length > 0) {
    loader.dataSource.data = loader.dataSource.data.filter(x => condition(x));
  }
};
