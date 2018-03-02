export const isIterable = function(obj) {
  if (!obj) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
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

export const isCallable = function(obj) {
  if (!obj) {
    return false;
  }
  return typeof obj === 'function';
};

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
