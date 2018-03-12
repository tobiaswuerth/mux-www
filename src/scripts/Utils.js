export const isIterable = function(obj) {
  if (!obj) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
};

export const isObject = function(obj) {
  if (null == obj) {
    return false;
  }
  return typeof obj === 'object';
};

export const isCallable = function(obj) {
  if (!obj) {
    return false;
  }
  return typeof obj === 'function';
};

export const secondsToReadableString = function(seconds) {
  let hours = Math.floor(seconds / 3600);
  seconds = seconds - (hours * 3600);
  let minutes = Math.floor(seconds / 60);
  seconds = seconds - (minutes * 60);
  let result = '';
  if (hours > 0) {
    result += `${hours}:`;
  }
  if (minutes < 10) {
    result += 0;
  }
  result += minutes + ':';
  if (seconds < 10) {
    result += 0;
  }
  result += seconds.toFixed(0);
  return result;
};

export const makeUnique = function(iterable) {
  return [...new Set(iterable)];
};

async function asyncInvoke(input, payload) {
  await Promise.resolve(input).then(async (v) => {
    if (isCallable(v)) {
      await v.call(this, payload);
    }
  }).catch((r) => {
    console.error(r);
  });
}

export async function onceOrMore(prop, payload) {
  if (prop) {
    if (isIterable(prop)) {
      await prop.reduce(
        (a, b) => asyncInvoke(a, payload).then(() => asyncInvoke(b, payload))).
        catch((r) => {
          console.error(r);
        });
    } else {
      await asyncInvoke(prop, payload).catch((r) => {
        console.error(r);
      });
    }
  }
}

export const clone = function(obj) {
  return Object.assign({}, obj);
};

export const resolve = function(obj, payload) {
  let i = 0;
  while (isCallable(obj)) {
    obj = obj.call(this, payload);
    
    if (i++ >= 25) {
      throw new Error('infinite loop call (?)');
    }
  }
  return obj;
};
