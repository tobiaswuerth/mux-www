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
      let artistName = payload.name || '';
      let route = routes.get.artists.byName(artistName);
      return await performDefaultDataRequest(route, payload);
    },

  },
};
