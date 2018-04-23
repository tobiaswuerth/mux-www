import Store from './../../ecosystems/vuex/Store';
import {paths} from './../../ecosystems/vue-router/Router';

export const assertAuthenticated = async function(to, from, next) {
  if (!await Store.dispatch('auth/isAuthenticated').catch(console.error)) {
    next(paths.public.login);
  } else {
    next();
  }
};
export const assertNotAuthenticated = async function(to, from, next) {
  if (await Store.dispatch('auth/isAuthenticated').catch(console.error)) {
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
