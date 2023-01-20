import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {createRequire} from 'module';
import HtmlWebpackPlugin from "html-webpack-plugin";

const __dirname = dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);

export const composeCommonConfig = devOrProdMode => ({
  mode: devOrProdMode,

  entry: path.resolve(__dirname, "src/main/js", "app.jsx"),
  output: {
    filename: "js/[name].[contenthash:8].bundle.js",
    path: path.resolve(__dirname, "target/classes")
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "CVtool",
      template: path.resolve(__dirname, "src/main/js/index.html"),
      inject: true,
      favicon: path.resolve(__dirname, "src/main/js/static", "favicon.ico")
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(Headless.*|node|node_modules|target)/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            envName: devOrProdMode,
            env: {
              production: {
                only: [
                  "src"
                ],
                plugins: [
                  [
                    "transform-react-remove-prop-types",
                    {
                      removeImport: devOrProdMode === 'development'
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
      },
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
  },

  devServer: {
    static: "./target/classes",
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
  }
});