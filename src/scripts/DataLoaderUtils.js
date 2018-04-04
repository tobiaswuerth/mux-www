import {isCallable} from './Utils';
import DataLoader from './DataLoader';
import {makeUnique, makeUniqueByKey} from './DataUtils';

export const onAfterUniqueByKey = (key) => (payload) => {
  payload.dataSource.data = makeUniqueByKey(payload.dataSource.data, key);
};

export const onAfterUnique = (payload) => {
  payload.dataSource.data = makeUnique(payload.dataSource.data);
};

export const onAfterSingle = (payload) => {
  if (payload.dataSource.data.length > 0) {
    payload.dataSource.data = payload.dataSource.data[0];
  }
};

export const onAfterSort = (payload) => {
  if (payload.dataSource.data.length > 0) {
    let tk = payload.loader.parent.toString1;
    payload.dataSource.data = payload.dataSource.data.sort((a, b) => {
      if (isCallable(tk)) {
        let valA = tk.call(payload.loader, a);
        let valB = tk.call(payload.loader, b);
        return valA > valB ? 1 : -1;
      }
      return a[tk] > b[tk] ? 1 : -1;
    });
  }
};

export const onAfterMap = (mapper) => (payload) => {
  if (payload.dataSource.data.length > 0) {
    payload.dataSource.data = payload.dataSource.data.map(
      x => mapper(x, payload));
  }
};

export const onAfterLog = (payload) => {
  // for debug purpose
  console.log(payload.dataSource.data);
};

export const onAfterFilter = (condition) => (payload) => {
  if (payload.dataSource.data.length > 0) {
    payload.dataSource.data = payload.dataSource.data.filter(
      x => condition(x, payload));
  }
};

export const simplyLoad = async (route, payload = {}, onAfter = null) => {
  let loader = new DataLoader(route);
  let config = {doPreload: true};
  loader.onAfter = onAfter;
  return await loader.load(payload, config).catch(console.error);
};

export const simplyLoadAll = async (route, payloads, onAfter) => {
  let loader = new DataLoader(route);
  let config = {doPreload: true};
  loader.onAfter = onAfter;
  return await loader.loadAll(payloads, config).catch(console.error);
};
