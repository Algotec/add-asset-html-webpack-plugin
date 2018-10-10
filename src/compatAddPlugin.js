export default function compatAddPlugin(
  tappable,
  hookName,
  callback,
  async = false,
  name = callback.name,
  forType = null,
) {
  const method = async ? 'tapAsync' : 'tap';
  if (tappable.hooks) {
    if (forType) {
      tappable.hooks[hookName][method](forType, name, callback);
    } else {
      tappable.hooks[hookName][method](name, callback);
    }
  } else {
    tappable.plugin(hookName, callback);
  }
}
