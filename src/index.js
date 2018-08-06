import applyManipulatorsToCompilation from './applyManipulationToCompilation';

export default class ManipulateAssetsHtmlWebpackPlugin {
  constructor(manipulators = []) {
    this.manipulators = Array.isArray(manipulators)
      ? manipulators.slice().reverse()
      : [manipulators];
  }

  /* istanbul ignore next: this would be integration tests */
  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin(
        'html-webpack-plugin-before-html-generation',
        (htmlPluginData, callback) =>
          applyManipulatorsToCompilation(
            this.manipulators,
            compilation,
            htmlPluginData,
            callback,
          ),
      );
    });
  }
}
