import Store from './../../ecosystems/vuex/Store';
import Routes from './../../ecosystems/vue-router/Routes';

export const assertAuthenticated = (to, from, next) => {
  if (!Store.getters['auth/isAuthenticated']) {
    console.log('-> reroute unauthenticated request to public login');
    next(Routes.public.login);
  } else {
    next();
  }
};

export const assertNotAuthenticated = (to, from, next) => {
  if (Store.getters['auth/isAuthenticated']) {
    console.log('-> reroute authenticated request to private main');
    next(Routes.private.root);
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
