import DataSource from './DataSource';
import {clone, onceOrMore} from './Utils';
import Store from './../ecosystems/vuex/Store';

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

DataLoader.prototype.load = async function(payload, config = {}) {
  return await this.loadAll([payload], config);
};

DataLoader.prototype.loadAll = async function(payloads, config = {}) {
  this._runningRequests++;
  this.isLoading = true;
  
  // prepare
  if (true === config.doPreload) {
    payloads.forEach(p => p.pageSize = 100); // fastest possible preloading
  }
  
  let source = new DataSource();
  
  // execute
  let promises = payloads.map(
    p => Store.dispatch(this.route, p).then(async (v) => {
        source.addAll(v.data);
        
        if (v.hasMore) {
          updatePayload(p);
          
          // load more
          if (true === config.doPreload) {
            let subConfig = clone(config);
            subConfig.suppressEvents = true;
            subConfig.appendToSource = false;
            
            await this.load(p, subConfig).then((v) => source.addAll(v));
          } else {
            this._morePayloads.push(p);
          }
        }
      }).
      catch((r) => {
        console.error(r);
        this._morePayloads.push(p);
        return Promise.reject(r);
      }).
      finally(() => {
        this._runningRequests--;
        this.isLoading = this._runningRequests > 0;
      }));
  
  // await and process results
  return await Promise.all(promises).then(async () => {
      if (false !== config.appendToSource) {
        source.data = this.dataSource.data.concat(source.data);
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
    return Promise.resolve(this.dataSource.data);
  }
  
  let payloads = this._morePayloads;
  this._morePayloads = [];
  return await this.loadAll(payloads, config).catch((r) => {
    console.error(r);
  })
};

export default DataLoader;










