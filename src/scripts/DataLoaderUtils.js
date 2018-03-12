import {isCallable} from './Utils';
import DataLoader from './DataLoader';

export const onAfterUnique = (payload) => {
  let data = payload.dataSource.data;
  if (data.length > 0) {
    // treat data as object array
    let vk = payload.loader.parent.valueKey;
    let d = data.map(x => [x[vk].toString().normalize(), x]);
    d = new Map(d).values();
    d = Array.from(d);
    payload.dataSource.data = d;
  }
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

export const simplyLoad = async (route, payload, onAfter) => {
  let loader = new DataLoader(route);
  let config = {doPreload: true};
  loader.onAfter = onAfter;
  let data = await loader.load(payload, config).catch((r) => {
    console.error(r);
  });
  return Promise.resolve(data);
};

export const simplyLoadAll = async (route, payloads, onAfter) => {
  let data = [];
  let promises = payloads.map((p) => simplyLoad(route, p, onAfter).
    then((d) => data = data.concat(d)));
  await Promise.all(promises).catch((r) => {
    console.error(r);
  });
  return Promise.resolve(data);
};
