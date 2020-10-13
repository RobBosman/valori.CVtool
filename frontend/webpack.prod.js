const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "CVtool",
      template: path.resolve(__dirname, "src", "static", "index.html"),
      inject: true,
      favicon: path.resolve(__dirname, "src", "static", "favicon.ico")
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(Headless.*|coverage|dist|node|node_modules)/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            envName: "production",
            env: {
              production: {
                only: [
                  "src"
                ],
                plugins: [
                  [
                    "transform-react-remove-prop-types",
                    {
                      removeImport: false
                    }
                  ],
                  "@babel/plugin-transform-react-inline-elements",
                  "@babel/plugin-transform-react-constant-elements"
                ]
              }
            },
            cacheDirectory: true,
            cacheCompression: false
          }
        }
      }
    ]
  },
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