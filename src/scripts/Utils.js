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

async function asyncInvoke(input, payload) {
  await Promise.resolve(input).then(async (v) => {
    if (isCallable(v)) {
      await v.call(this, payload);
    }
  }).catch(console.error);
}

export async function onceOrMore(prop, payload) {
  if (prop) {
    if (isIterable(prop)) {
      await prop.reduce(
        (a, b) => asyncInvoke(a, payload).then(() => asyncInvoke(b, payload))).
        catch(console.error);
    } else {
      await asyncInvoke(prop, payload).catch(console.error);
    }
  }
}

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

export const matchScale = [
  {
    from: .0,
    to: .7,
    icon: 'sentiment_very_dissatisfied',
    text: 'horrible',
    color: '#ff0000',
  },
  {
    from: .7,
    to: .825,
    icon: 'sentiment_dissatisfied',
    text: 'bad',
    color: '#ff7f00',
  },
  {
    from: .825,
    to: .9,
    icon: 'sentiment_neutral',
    text: 'ok',
    color: '#ffff00',
  },
  {
    from: .9,
    to: .95,
    icon: 'sentiment_satisfied',
    text: 'good',
    color: '#7fff00',
  },
  {
    from: .95,
    to: 1,
    icon: 'sentiment_very_satisfied',
    text: 'excellent',
    color: '#00ff00',
  }];
