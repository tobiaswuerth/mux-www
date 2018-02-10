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

// routes
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
    },
    
    records: {
      all: `${config.prefix.authorized}/records`,
      byName: (name) => `${config.prefix.authorized}/records/lookup/${encodeURIComponent(
        name)}`,
      byId: (id) => `${config.prefix.authorized}/records/${id}`,
    },
  },
};

async function performDefaultDataRequest(route, payload) {
  // prepare
  let pageIndex = payload.pageIndex || 0;
  let pageSize = payload.pageSize || DEFAULT_PAGE_SIZE;
  let url = `${route}?p=${pageIndex}&ps=${pageSize}`;
  let options = Store.getters['auth/authDefaultOptions'];
  
  // perform request
  let response = await axios.get(url, options);
  
  // prepare return
  let data = response.data;
  let count = data.length;
  let hasMore = count === pageSize;
  return Promise.resolve({data, count, hasMore, pageIndex, pageSize});
}

export default {
  namespaced: true,
  
  actions: {
    async login({}, payload) {
      let response = await axios.post(routes.post.login.performLogin, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return Promise.resolve({data: response.data});
    },
    
    async artists({}, payload) {
      return await performDefaultDataRequest(routes.get.artists.all, payload);
    },
    
    async artistsByName({}, payload) {
      let name = payload.name;
      if (!name) {
        return Promise.reject('undefined name');
      }
      let route = routes.get.artists.byName(name);
      return await performDefaultDataRequest(route, payload);
    },
    
    async artistById({}, payload) {
      let id = payload.id;
      if (!id) {
        return Promise.reject('undefined id');
      }
      let route = routes.get.artists.byId(id);
      return await performDefaultDataRequest(route, payload);
    },
    
    async artistReleasesById({}, payload) {
      let id = payload.id;
      if (!id) {
        return Promise.reject('undefined id');
      }
      let route = routes.get.artists.releasesById(id);
      return await performDefaultDataRequest(route, payload);
    },
    
    async artistRecordsById({}, payload) {
      let id = payload.id;
      if (!id) {
        return Promise.reject('undefined id');
      }
      let route = routes.get.artists.recordsById(id);
      return await performDefaultDataRequest(route, payload);
    },
    
    async releases({}, payload) {
      return await performDefaultDataRequest(routes.get.releases.all, payload);
    },
    
    async releasesByName({}, payload) {
      let name = payload.name;
      if (!name) {
        return Promise.reject('undefined name');
      }
      let route = routes.get.releases.byName(name);
      return await performDefaultDataRequest(route, payload);
    },
    
    async releaseById({}, payload) {
      let id = payload.id;
      if (!id) {
        return Promise.reject('undefined id');
      }
      let route = routes.get.releases.byId(id);
      return await performDefaultDataRequest(route, payload);
    },
    
    async releaseArtistsById({}, payload) {
      let id = payload.id;
      if (!id) {
        return Promise.reject('undefined id');
      }
      let route = routes.get.releases.artistsById(id);
      return await performDefaultDataRequest(route, payload);
    },
    
    async records({}, payload) {
      return await performDefaultDataRequest(routes.get.records.all, payload);
    },
    
    async recordsByName({}, payload) {
      let name = payload.name;
      if (!name) {
        return Promise.reject('undefined name');
      }
      let route = routes.get.records.byName(name);
      return await performDefaultDataRequest(route, payload);
    },
    
    async recordById({}, payload) {
      let id = payload.id;
      if (!id) {
        return Promise.reject('undefined id');
      }
      let route = routes.get.records.byId(id);
      return await performDefaultDataRequest(route, payload);
    },
  },
};
