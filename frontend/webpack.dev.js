const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",

  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      title: "DEV-CVtool",
      template: path.resolve(__dirname, "src", "static", "index.html"),
      inject: true,
      favicon: path.resolve(__dirname, "src", "static", "favicon.ico")
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(Headless.*|dist|node|node_modules|target)/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            envName: "development",
            env: {
              production: {
                only: [
                  "src"
                ],
                plugins: [
                  [
                    "transform-react-remove-prop-types",
                    {
                      removeImport: true
                    }
                  ],
                  "@babel/plugin-transform-react-constant-elements",
                  "@babel/plugin-transform-react-inline-elements"
                ]
              }
            },
            cacheDirectory: true,
            cacheCompression: false
          }
        }
      }
    ]
  }
});