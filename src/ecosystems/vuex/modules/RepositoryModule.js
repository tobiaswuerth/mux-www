import Axios from 'axios';
import Store from '../Store';

const DEFAULT_PAGE_SIZE = 50;

// init
const axios = Axios.create({
  baseURL: 'https://mux.fooo.ooo/api/v1',
});

// config
const config = {
  prefix: {
    unauthorized: '/public', authorized: '/auth',
  },
};

// Routes
const routes = {
  config,
  
  post: {
    login: {
      performLogin: `${config.prefix.unauthorized}/login`,
    },
  },
  
  get: {
    login: {
      refreshToken: `${config.prefix.authorized}/login`,
    },
    
    artists: {
      all: `${config.prefix.authorized}/artists`,
      byName: (name) => `${config.prefix.authorized}/artists/lookup/
        ${encodeURIComponent(name)}`,
      byId: (id) => `${config.prefix.authorized}/artists/${id}`,
      releasesById: (id) => `${config.prefix.authorized}/artists/${id}/releases`,
      recordsById: (id) => `${config.prefix.authorized}/artists/${id}/records`,
    },
    
    releases: {
      all: `${config.prefix.authorized}/releases`,
      byName: (name) => `${config.prefix.authorized}/releases/lookup/${encodeURIComponent(
        name)}`,
      byId: (id) => `${config.prefix.authorized}/releases/${id}`,
      artistsById: (id) => `${config.prefix.authorized}/releases/${id}/artists`,
      recordsById: (id) => `${config.prefix.authorized}/releases/${id}/records`,
      aliasesById: (id) => `${config.prefix.authorized}/releases/${id}/aliases`,
    },
    
    records: {
      all: `${config.prefix.authorized}/records`,
      byName: (name) => `${config.prefix.authorized}/records/lookup/${encodeURIComponent(
        name)}`,
      byId: (id) => `${config.prefix.authorized}/records/${id}`,
      tracksById: (id) => `${config.prefix.authorized}/records/${id}/tracks`,
      releasesById: (id) => `${config.prefix.authorized}/records/${id}/releases`,
      artistsById: (id) => `${config.prefix.authorized}/records/${id}/artists`,
      aliasesById: (id) => `${config.prefix.authorized}/records/${id}/aliases`,
    },
    
    tracks: {
      all: `${config.prefix.authorized}/tracks`,
      byId: (id) => `${config.prefix.authorized}/tracks/${id}`,
    },
  },
};

async function performParamDefaultDataRequest(payload, props) {
  // get key
  let keys = Object.keys(props);
  if (keys.length !== 1) {
    return Promise.reject(`invalid amount of required keys '${keys.length}'`);
  }
  
  // get value
  let key = keys[0];
  let val = payload[key];
  if (!val) {
    return Promise.reject(`value for key '${key}' undefined`);
  }
  
  // build route
  let route = props[key](val);
  if (!route) {
    return Promise.reject(
      `building route failed for key '${key}' and value '${val}'`);
  }
  
  // perform request
  return performDefaultDataRequest(route, payload);
}

const cache = {};
const cacheInvalidationInterval = 1000 * 60 * 5; // 5min;

setInterval(() => {
  let now = new Date();
  let keysToDelete = [];
  Object.keys(cache).forEach(x => {
    if ((now - cache[x].date) > cacheInvalidationInterval) {
      keysToDelete.push(x);
    }
  });
  keysToDelete.forEach(x => delete cache[x]);
}, cacheInvalidationInterval);

async function performDefaultDataRequest(route, payload) {
  // prepare
  let pageIndex = payload.pageIndex || 0;
  let pageSize = payload.pageSize || DEFAULT_PAGE_SIZE;
  let url = `${route}?p=${pageIndex}&ps=${pageSize}`;
  let options = Store.getters['auth/authDefaultOptions'];
  
  // check cache
  let entry = cache[url];
  if (entry) {
    return Promise.resolve(entry);
  }
  
  // perform request
  let response = await axios.get(url, options);
  
  // prepare return
  let data = response.data;
  let count = data.length;
  let hasMore = count === pageSize;
  let resolvedData = {
    data, count, hasMore, pageIndex, pageSize, date: new Date(),
  };
  cache[url] = resolvedData;
  
  return Promise.resolve(resolvedData);
}

export default {
  namespaced: true,
  
  actions: {
    // login
    async login({}, payload) {
      let response = await axios.post(routes.post.login.performLogin, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return Promise.resolve({data: response.data});
    },
    
    // artists
    async artists({}, payload) {
      return await performDefaultDataRequest(routes.get.artists.all, payload);
    }, async artistsByName({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {name: routes.get.artists.byName});
    }, async artistById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.artists.byId});
    }, async artistReleasesById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.artists.releasesById});
    }, async artistRecordsById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.artists.recordsById});
    },
    
    // releases
    async releases({}, payload) {
      return await performDefaultDataRequest(routes.get.releases.all, payload);
    }, async releasesByName({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {name: routes.get.releases.byName});
    }, async releaseById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.releases.byId});
    }, async releaseArtistsById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.releases.artistsById});
    }, async releaseRecordsById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.releases.recordsById});
    }, async releasesAliasesById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.releases.aliasesById});
    },
    
    // records
    async records({}, payload) {
      return await performDefaultDataRequest(routes.get.records.all, payload);
    }, async recordsByName({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {name: routes.get.records.byName});
    }, async recordById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.records.byId});
    }, async recordTracksById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.records.tracksById});
    }, async recordReleasesById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.records.releasesById});
    }, async recordArtistsById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.records.artistsById});
    }, async recordAliasesById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.records.aliasesById});
    },
    
    // tracks
    async tracks({}, payload) {
      return await performDefaultDataRequest(routes.get.tracks.all, payload);
    }, async trackById({}, payload) {
      return await performParamDefaultDataRequest(payload,
        {id: routes.get.tracks.byId});
    },
  },
};
