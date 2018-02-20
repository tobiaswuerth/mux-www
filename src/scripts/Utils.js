export const isIterable = function(obj) {
  if (!obj) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
};

export const onceOrMore = function(prop, payload) {
  if (prop) {
    if (isIterable(prop)) {
      prop.forEach(p => p(payload));
    } else {
      prop(payload);
    }
  }
};

export const isCallable = function(obj) {
  if (!obj) {
    return false;
  }
  return typeof obj === 'function';
};
