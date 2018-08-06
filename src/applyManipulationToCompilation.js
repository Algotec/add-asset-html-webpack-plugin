import pEachSeries from 'p-each-series';
import * as path from 'path';
import * as crypto from 'crypto';

// Copied from html-webpack-plugin
function ensureTrailingSlash(string) {
  if (string.length && string.substr(-1, 1) !== '/') {
    return `${string}/`;
  }

  return string;
}

function resolvePublicPath(compilation, filename) {
  /* istanbul ignore else */
  const publicPath =
    typeof compilation.options.output.publicPath !== 'undefined'
      ? compilation.options.output.publicPath
      : path.relative(path.dirname(filename), '.'); // TODO: How to test this? I haven't written this logic, unsure what it does

  return ensureTrailingSlash(publicPath);
}

function resolveOutput(compilation, addedFilename, outputPath) {
  if (outputPath && outputPath.length) {
    /* eslint-disable no-param-reassign */
    compilation.assets[`${outputPath}/${addedFilename}`] =
      compilation.assets[addedFilename];
    delete compilation.assets[addedFilename];
    /* eslint-enable */
  }
}

async function applyManipulation(compilation, htmlPluginData, manipulation) {
  const mayBePromise = manipulation.apply(compilation, [
    htmlPluginData,
    (filePath, hash) =>
      htmlPluginData.plugin.addFileToAssets(filePath, compilation).then(() => {
        let suffix = '';
        if (hash) {
          const md5 = crypto.createHash('md5');
          md5.update(compilation.assets[filePath].source());
          suffix = `?${md5.digest('hex').substr(0, 20)}`;
        }
        const resolvedPublicPath = resolvePublicPath(compilation, filePath);
        const resolvedPath = `${resolvedPublicPath}${filePath}${suffix}`;

        htmlPluginData.assets.js.unshift(resolvedPath);

        resolveOutput(
          compilation,
          resolvedPath,
          compilation.compiler.options.output.path,
        );
      }),
  ]);
  return Promise.resolve(mayBePromise);
}

// Visible for testing
export default async function(
  manipulators,
  compilation,
  htmlPluginData,
  callback,
) {
  try {
    await pEachSeries(manipulators, manipulation =>
      applyManipulation(compilation, htmlPluginData, manipulation),
    );
    if (callback) {
      return callback(null, htmlPluginData);
    }
    return htmlPluginData;
  } catch (e) {
    if (callback) {
      return callback(e, htmlPluginData);
    }
    throw e;
  }
}
