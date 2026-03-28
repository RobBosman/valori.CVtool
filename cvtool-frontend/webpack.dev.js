import {merge} from "webpack-merge";
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import {composeCommonConfig} from "./webpack.common.js";

export default merge(composeCommonConfig("development"), {
  devtool: "inline-source-map",
  devServer: {
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })
  ]
});