function* capitlizeFirstLetter(str) {
  for (const [i, l] of Array.from(str).entries()) {
    yield i === 0 ? l.toUpperCase() : l;
  }
}

function* capitalizeWordsArray(rest) {
  for (const word of rest) {
    yield* capitlizeFirstLetter(word);
  }
}

function kebbabCase2CamelCase(str) {
  const strArr = str.split('-');
  if (strArr.length < 2) return str;
  const [first, ...rest] = strArr;
  const restGen = capitalizeWordsArray(rest);
  return [first, ...restGen].join('');
}

export default function compatAddPluginHook(name) {
  return (tappable, hookName, callback, async = false, forType = null) => {
    if (tappable.hooks) {
      let method = 'tap';
      if (async) {
        if (async.constructor.name === Promise.constructor.name) {
          method = 'tapPromise';
        } else {
          method = 'tapAsync';
        }
      }
      const kebabHook = kebbabCase2CamelCase(hookName);
      if (forType) {
        tappable.hooks[kebabHook][method](forType, name, callback);
      } else {
        tappable.hooks[kebabHook][method](name, callback);
      }
    } else {
      tappable.plugin(hookName, callback);
    }
  };
}
