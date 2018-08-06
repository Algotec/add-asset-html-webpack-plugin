import {compilation} from "webpack";

declare namespace ManipulateAssetsHtmlWebpackPlugin {

  export type manipulatationFn = (this: compilation.Compilation, HtmlWebpackPluginData: any, additionFn: (fileName: string) => Promise<any>) => Promise<any>
}

declare class ManipulateAssetsHtmlWebpackPlugin {
  constructor(options: ManipulateAssetsHtmlWebpackPlugin.manipulatationFn | ManipulateAssetsHtmlWebpackPlugin.manipulatationFn[]);

  apply(compiler: any): void;
}

export = ManipulateAssetsHtmlWebpackPlugin;
