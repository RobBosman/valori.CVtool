import {merge} from "webpack-merge";
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import {composeCommonConfig} from "./webpack.common.js";

export default merge(composeCommonConfig("production"), {
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 0,
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      maxSize: 24000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `${cacheGroupKey}.${packageName.replace("@", "")}`;
          }
        },
        common: {
          minChunks: 2,
          priority: -10
        }
      }
    },
    runtimeChunk: "single"
  }
});