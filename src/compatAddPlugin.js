export default function compatAddPluginHook(name) {
  return (tappable, hookName, callback, async = false, forType = null) => {
    let method = 'tap';
    if (async) {
      if (async.constructor.name === Promise.constructor.name) {
        method = 'tapPromise';
      } else {
        method = 'tapAsync';
      }
    }
    if (tappable.hooks) {
      if (forType) {
        tappable.hooks[hookName][method](forType, name, callback);
      } else {
        tappable.hooks[hookName][method](name, callback);
      }
    } else {
      tappable.plugin(hookName, callback);
    }
  };
}
