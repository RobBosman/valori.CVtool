const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src", "app.jsx"),
  output: {
    filename: "js/[name].[contenthash:8].bundle.js",
    path: path.resolve(__dirname, "dist")
  },

  devServer: {
    static: "./dist",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    open: true,
    port: 8000,
    proxy: {
      "/eventbus": {
        target: "http://localhost:80/",
        secure: false,
        changeOrigin: true
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(svg|png|jpg|gif)$/i,
        use: {
          loader: require.resolve("url-loader"),
          options: {
            limit: 8192,
            name: "static/[name].[contenthash:8].[ext]"
          }
        }
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        loader: require.resolve("file-loader"),
        options: {
          name: "static/[name].[contenthash:8].[ext]"
        }
      }
    ]
  },
  resolve: {
    extensions: [
      ".js",
      ".jsx"
    ]
  }
};