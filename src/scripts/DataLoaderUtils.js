import {isCallable, resolve} from './Utils';
import DataLoader from './DataLoader';

export const onAfterUnique = (payload) => {
  if (payload.dataSource.data.length > 0) {
    let vk = payload.loader.parent.valueKey;
    let d = payload.dataSource.data.map(x => [x[vk].toString().normalize(), x]);
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

export const onAfterSelect = (key) => (payload) => {
  if (payload.dataSource.data.length > 0) {
    payload.dataSource.data = payload.dataSource.data.map(x => x[key]);
  }
};

export const onAfterFilter = (condition) => (payload) => {
  if (payload.dataSource.data.length > 0) {
    payload.dataSource.data = payload.dataSource.data.filter(x => condition(x));
  }
};

export const onAfterMerge = (input) => async function(payload) {
  input = resolve(input, payload.loader.parent);
  await Promise.resolve(input).then((data) => {
    payload.dataSource.data.push(...data);
  }).catch((r) => {
    console.error(r);
  });
};

export const simplyLoad = async (route, payload, filter, map) => {
  let loader = new DataLoader(route);
  let config = {doPreload: true, returnData: true};
  let data = await loader.load(payload, config);
  
  data = data.filter(x => filter(x));
  data = data.map(x => map(x));
  return Promise.resolve(data);
};
