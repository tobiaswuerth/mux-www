import Axios from 'axios';
import Store from '../Store';

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
    },
  },
};

const authHeader = () => {
  // validate
  if (!Store.getters['auth/isAuthenticated']) {
    console.error('Cannot build authorization header in unauthorized state');
    return;
  }

  let data = Store.getters['auth/data'];
  if (!data.token) {
    console.error(
      'Cannot build authorization header without authorization token');
    return;
  }

  // build
  return {
    'Authorization': `Bearer ${data.token}`,
  };
};

const buildUrl = (url, payload) => {
  let pageIndex = payload.pageIndex || 0;
  let pageSize = payload.pageSize || 50;

  return `${url}?p=${pageIndex}&ps=${pageSize}`;
};

export default {
  namespaced: true,

  actions: {
    login: ({}, payload) => {
      return axios.post(routes.post.login.performLogin, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },

    artists: ({}, payload) => {
      return axios.get(buildUrl(routes.get.artists.all, payload), {
        headers: authHeader(),
      });
    },

  },
};
