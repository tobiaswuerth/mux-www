import DataSource from './DataSource';
import Store from './../ecosystems/vuex/Store';
import {clone, onceOrMore} from './Utils';

function DataLoader(route, parent) {
  this.route = route;
  this.dataSource = new DataSource();
  this.onAfter = null;
  this.parent = parent;
  this.isLoading = true;
  
  this._morePayloads = [];
  this._runningRequests = 0;
}

DataLoader.prototype.hasMore = function() {
  return this._morePayloads.length > 0;
};

const updatePayload = (payload) => {
  payload.pageIndex = payload.pageIndex ? payload.pageIndex + 1 : 1;
};

const preLoad = (config, payload, dataSource) => {
  this._runningRequests++;
  
  // prepare
  if (true === config.doPreload) {
    payload.pageSize = 100; // fastest possible preloading
  }
  
  return config.appendToSource === false ? new DataSource() : new DataSource(
    dataSource.data);
};

DataLoader.prototype.load = async function(payload, config = {}) {
  // prepare
  let source = preLoad(config, payload, this.dataSource);
  
  // execute and await result
  return await Store.dispatch(this.route, payload).then(async (v) => {
      source.addAll(v.data);
      
      if (v.hasMore) {
        updatePayload(payload);
        
        // load more
        if (true === config.doPreload) {
          let subConfig = clone(config);
          subConfig.suppressEvents = true;
          subConfig.appendToSource = false;
          
          await this.load(payload, subConfig).
            then((v) => source.addAll(v)).
            catch((r) => {
              console.error(r);
              return Promise.reject(r);
            });
        } else {
          this._morePayloads.push(payload);
        }
      }
      
      if (false !== config.appendToSource) {
        source.addAll(this.dataSource.data);
      }
      
      // events
      if (true !== config.suppressEvents) {
        await onceOrMore(this.onAfter, {loader: this, dataSource: source}).
          catch((r) => {
            console.error(r);
            return Promise.reject(r);
          });
      }
      
      // finalize
      if (false === config.appendToSource) {
        return Promise.resolve(source.data);
      }
      
      this.dataSource.data = source.data;
      return Promise.resolve(this.dataSource.data);
    }).
    catch(r => {
      console.error(r);
      this._morePayloads.push(payload);
      return Promise.reject(r);
    }).
    finally(() => {
      this._runningRequests--;
      this.isLoading = this._runningRequests > 0;
    });
};

DataLoader.prototype.loadAll = async function(payloads, config = {}) {
  // prepare
  let source = preLoad(config, payloads, this.dataSource);
  
  let subConfig = clone(config);
  subConfig.suppressEvents = true;
  subConfig.appendToSource = false;
  
  // execute
  let promises = payloads.map(
    p => this.load(p, subConfig).then((v) => source.addAll(v)));
  
  // await and process results
  return await Promise.all(promises).then(async () => {
      if (false !== config.appendToSource) {
        source.addAll(this.dataSource.data);
      }
      
      // events
      if (true !== config.suppressEvents) {
        await onceOrMore(this.onAfter, {loader: this, dataSource: source}).
          catch((r) => {
            console.error(r);
          });
      }
      
      // finalize
      if (false === config.appendToSource) {
        return Promise.resolve(source.data);
      }
      
      this.dataSource.data = source.data;
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

DataLoader.prototype.loadMore = async function(config = {}) {
  if (this._morePayloads.length === 0) {
    return Promise.resolve();
  }
  
  let promises = [];
  let p;
  
  // execute
  while ((p = this._morePayloads.shift()) != null) {
    promises.push(this.load(p, config));
  }
  
  // await results
  await Promise.all(promises).then(() => {
    return Promise.resolve(this.dataSource.data);
  }).catch(r => {
    console.error(r);
    return Promise.reject(r);
  });
};

export default DataLoader;










