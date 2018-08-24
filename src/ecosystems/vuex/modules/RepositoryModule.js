import Axios from 'axios';
import Store from '../Store';
import Router from './../../vue-router/Router';

const DEFAULT_PAGE_SIZE = 50;

export const urlBase = 'https://mux.fooo.ooo';
export const apiBase = `${urlBase}/api/v1`;

// init
const axios = Axios.create({
  baseURL: apiBase,
});

// config
const config = {
  prefix: {
    unauthorized: '/public', authorized: '/auth',
  },
};

// Routes
export const routes = {
  config,
  
  post: {
    login: {
      performLogin: `${config.prefix.unauthorized}/login`,
    },
    
    invites: {
      byToken: (token) => `${config.prefix.unauthorized}/invites/${token}`,
    },
  },
  
  get: {
    login: {
      refresh: `${config.prefix.authorized}/login`,
    },
    
    artists: {
      all: `${config.prefix.authorized}/artists`,
      byName: (name) => `${config.prefix.authorized}/artists/lookup/
        ${encodeURIComponent(name)}`,
      likeName: (name) => `${config.prefix.authorized}/artists/search/
        ${encodeURIComponent(name)}`,
      byId: (id) => `${config.prefix.authorized}/artists/${id}`,
      releasesById: (id) => `${config.prefix.authorized}/artists/${id}/releases`,
      recordsById: (id) => `${config.prefix.authorized}/artists/${id}/records`,
    },
    
    releases: {
      all: `${config.prefix.authorized}/releases`,
      byName: (name) => `${config.prefix.authorized}/releases/lookup/${encodeURIComponent(
        name)}`,
      likeName: (name) => `${config.prefix.authorized}/releases/search/${encodeURIComponent(
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
      likeName: (name) => `${config.prefix.authorized}/records/search/${encodeURIComponent(
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
      likeName: (name) => `${config.prefix.authorized}/tracks/search/${encodeURIComponent(
        name)}`,
    },
    
    files: {
      byId: (id) => `${config.prefix.authorized}/files/${id}`,
    },
    
    invites: {
      all: `${config.prefix.authorized}/invites`,
    },
  
    playlists: {
      all: `${config.prefix.authorized}/playlists`,
      byId: (id) => `${config.prefix.authorized}/playlists/${id}`,
    },
  
    users: {
      all: `${config.prefix.authorized}/users`,
    },
  },
  
  put: {
    invites: {
      create: `${config.prefix.authorized}/invites`,
    },
  
    playlists: {
      create: `${config.prefix.authorized}/playlists`,
      update: (id) => `${config.prefix.authorized}/playlists/${id}`,
      createEntry: (id) => `${config.prefix.authorized}/playlists/${id}/entries`,
      createPermission: (id) => `${config.prefix.authorized}/playlists/${id}/permissions`,
    },
  },
  
  delete: {
    invites: {
      byId: (id) => `${config.prefix.authorized}/invites/${id}`,
    },
  
    playlists: {
      byId: (id) => `${config.prefix.authorized}/playlists/${id}`,
      entryById: (playlistId,
                  entryId) => `${config.prefix.authorized}/playlists/${playlistId}/entries/${entryId}`,
      permissionById: (
        playlistId,
        permissionId) => `${config.prefix.authorized}/playlists/${playlistId}/permissions/${permissionId}`,
    },
  },
};

const cache = {};
const cacheInvalidationInterval = 1000 * 60 * 10; // 10 min;

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

const getConfig = (method = axios.get, doAuthenticate = true, doCache = true,
                   doPaginate = true) => Object.assign({
  doPaginate: doPaginate,
  doCache: doCache,
  doAuthenticate: doAuthenticate,
  method: method,
});

async function performRequest(route, payload = {}, config = getConfig()) {
  // prepare
  let url = route;
  let pageIndex = payload.pageIndex || 0;
  let pageSize = payload.pageSize || DEFAULT_PAGE_SIZE;
  if (config.doPaginate) {
    url = `${route}?p=${pageIndex}&ps=${pageSize}`;
  }
  
  let options = config.doAuthenticate ? await Store.dispatch(
    'auth/getAuthenticationHeaders').catch(console.error) : Object.assign(
    {headers: {'Content-Type': 'application/json'}});
  
  // check cache
  if (config.doCache) {
    let entry = cache[url];
    if (entry) {
      return Promise.resolve(entry);
    }
  }
  
  // perform request
  let method = config.method;
  let requestHasBody = method === axios.put || method === axios.post ||
    method === axios.patch;
  let promise = requestHasBody ? method(url, payload, options) : method(url,
    options);
  let response = await promise.catch((e) => {
    if (e.response && e.response.status === 401) {
      // auth exception
      Store.dispatch('auth/updateAuthentication', null).then(() => {
        Router.push('/');
      }).catch(console.error);
    }
  });
  
  if (!response) {
    return Promise.reject('invalid response');
  }
  
  // prepare return
  let data = response.data;
  let count = data.length;
  let hasMore = config.doPaginate ? count === pageSize : false;
  let resolvedData = {
    data, count, hasMore, pageIndex, pageSize, date: new Date(),
  };
  
  if (config.doCache) {
    cache[url] = resolvedData;
  }
  
  return Promise.resolve(resolvedData);
}

export default {
  namespaced: true,
  
  actions: {
    // login
    login: async ({}, payload) => performRequest(routes.post.login.performLogin,
      payload, getConfig(axios.post, false, false, false)),
    loginRefresh: async () => await performRequest(routes.get.login.refresh, {},
      getConfig(axios.get, true, false, false)),
    
    // invites
    invites: async () => await performRequest(routes.get.invites.all, {},
      getConfig(axios.get, true, false, true)),
    invitesCreate: async ({}, payload) => await performRequest(
      routes.put.invites.create, payload,
      getConfig(axios.put, true, false, false)),
    invitesDelete: async ({}, payload) => await performRequest(
      routes.delete.invites.byId(payload.id), payload,
      getConfig(axios.delete, true, false, false)),
    invitesUse: async ({}, payload) => await performRequest(
      routes.post.invites.byToken(payload.token), payload,
      getConfig(axios.post, false, false, false)),
    
    // artists
    artists: async ({}, payload) => await performRequest(routes.get.artists.all,
      payload),
    artistsByName: async ({}, payload) => await performRequest(
      routes.get.artists.byName(payload.name), payload),
    artistById: async ({}, payload) => await performRequest(
      routes.get.artists.byId(payload.id), payload),
    artistReleasesById: async ({}, payload) => await performRequest(
      routes.get.artists.releasesById(payload.id), payload),
    artistRecordsById: async ({}, payload) => await performRequest(
      routes.get.artists.recordsById(payload.id), payload),
    artistsLikeName: async ({}, payload) => await performRequest(
      routes.get.artists.likeName(payload.name), payload),
    
    // releases
    releases: async ({}, payload) => await performRequest(
      routes.get.releases.all, payload),
    releasesByName: async ({}, payload) => await performRequest(
      routes.get.releases.byName(payload.name), payload),
    releaseById: async ({}, payload) => await performRequest(
      routes.get.releases.byId(payload.id), payload),
    releaseArtistsById: async ({}, payload) => await performRequest(
      routes.get.releases.artistsById(payload.id), payload),
    releaseRecordsById: async ({}, payload) => await performRequest(
      routes.get.releases.recordsById(payload.id), payload),
    releasesAliasesById: async ({}, payload) => await performRequest(
      routes.get.releases.aliasesById(payload.id), payload),
    releasesLikeName: async ({}, payload) => await performRequest(
      routes.get.releases.likeName(payload.name), payload),
    
    // records
    records: async ({}, payload) => await performRequest(routes.get.records.all,
      payload),
    recordsByName: async ({}, payload) => await performRequest(
      routes.get.records.byName(payload.name), payload),
    recordById: async ({}, payload) => await performRequest(
      routes.get.records.byId(payload.id), payload),
    recordTracksById: async ({}, payload) => await performRequest(
      routes.get.records.tracksById(payload.id), payload),
    recordReleasesById: async ({}, payload) => await performRequest(
      routes.get.records.releasesById(payload.id), payload),
    recordArtistsById: async ({}, payload) => await performRequest(
      routes.get.records.artistsById(payload.id), payload),
    recordAliasesById: async ({}, payload) => await performRequest(
      routes.get.records.aliasesById(payload.id), payload),
    recordsLikeName: async ({}, payload) => await performRequest(
      routes.get.records.likeName(payload.name), payload),
    
    // tracks
    tracks: async ({}, payload) => await performRequest(routes.get.tracks.all,
      payload),
    trackById: async ({}, payload) => await performRequest(
      routes.get.tracks.byId(payload.id), payload),
    tracksLikeName: async ({}, payload) => await performRequest(
      routes.get.tracks.likeName(payload.name), payload),
  
    // playlists
    playlists: async ({}, payload) => await performRequest(
      routes.get.playlists.all, payload,
      getConfig(axios.get, true, false, true)),
    playlistById: async ({}, payload) => await performRequest(
      routes.get.playlists.byId(payload.id), payload,
      getConfig(axios.get, true, false, false)),
    playlistsCreate: async ({}, payload) => await performRequest(
      routes.put.playlists.create, payload,
      getConfig(axios.put, true, false, false)),
    playlistsUpdate: async ({}, payload) => await performRequest(
      routes.put.playlists.update(payload.id), payload,
      getConfig(axios.put, true, false, false)),
    playlistsCreateEntry: async ({}, payload) => await performRequest(
      routes.put.playlists.createEntry(payload.id), payload,
      getConfig(axios.put, true, false, false)),
    playlistsCreatePermission: async ({}, payload) => await performRequest(
      routes.put.playlists.createPermission(payload.id), payload,
      getConfig(axios.put, true, false, false)),
    playlistsDelete: async ({}, payload) => await performRequest(
      routes.delete.playlists.byId(payload.id), payload,
      getConfig(axios.delete, true, false, false)),
    playlistsDeleteEntry: async ({}, payload) => await performRequest(
      routes.delete.playlists.entryById(payload.playlistId, payload.entryId),
      payload, getConfig(axios.delete, true, false, false)),
    playlistsDeletePermission: async ({}, payload) => await performRequest(
      routes.delete.playlists.permissionById(payload.playlistId,
        payload.permissionId), payload,
      getConfig(axios.delete, true, false, false)),
  
    // users
    users: async ({}, payload) => await performRequest(routes.get.users.all,
      payload),
  },
};
