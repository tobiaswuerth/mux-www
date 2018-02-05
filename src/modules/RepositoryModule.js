import Axios from 'axios';

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
  },
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
  },
};
