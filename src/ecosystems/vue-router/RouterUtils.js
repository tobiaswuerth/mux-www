import Store from './../../ecosystems/vuex/Store';
import {paths} from './../../ecosystems/vue-router/Router';

export const assertAuthenticated = (to, from, next) => {
  if (!Store.getters['auth/isAuthenticated']) {
    next(paths.public.login);
  } else {
    next();
  }
};

export const assertNotAuthenticated = (to, from, next) => {
  if (Store.getters['auth/isAuthenticated']) {
    next(paths.private.root);
  } else {
    next();
  }
};

export const prepareRoute = (route, params) => {
  Object.keys(params).forEach(k => {
    route = route.replace(`:${k}`, encodeURIComponent(params[k]));
  });
  return route;
};
