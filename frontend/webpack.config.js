'use strict';

const Path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Webpack = require("webpack");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const FileLoader = require.resolve("file-loader");

module.exports = (_env, argv) => {
    const isPROD = argv.mode === "production";
    return {
        devtool: !isPROD && "cheap-module-source-map",
        entry: "./src/index.js",
        output: {
            path: Path.resolve(__dirname, "dist"),
            filename: "js/[name].[contenthash:8].js",
            publicPath: "/"
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                            envName: isPROD ? "production" : "development"
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        isPROD ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader"
                    ]
                },
                {
                    test: /\.module.css$/,
                    use: [
                        isPROD ? MiniCssExtractPlugin.loader : "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                modules: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(sass|scss)$/,
                    use: [
                        isPROD ? MiniCssExtractPlugin.loader : "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 2
                            }
                        },
                        "resolve-url-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(svg|png|jpg|gif)$/i,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            name: "static/[name].[hash:8].[ext]"
                        }
                    }
                },
                {
                    test: /\.(eot|otf|ttf|woff|woff2)$/,
                    loader: FileLoader,
                    options: {
                        name: "static/[name].[hash:8].[ext]"
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
        plugins: [
            isPROD && new MiniCssExtractPlugin({
                filename: "css/[name].[contenthash:8].css",
                chunkFilename: "css/[name].[contenthash:8].chunk.css"
            }),
            new HtmlWebpackPlugin({
                template: Path.resolve(__dirname, "static/index.html"),
                inject: true,
                favicon: "static/favicon.ico"
            }),
            new Webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(isPROD ? "production" : "development")
            })
        ].filter(Boolean),
        optimization: {
            minimize: isPROD,
            minimizer: [
                new TerserWebpackPlugin({
                    terserOptions: {
                        compress: {
                            comparisons: false
                        },
                        mangle: {
                            safari10: true
                        },
                        output: {
                            comments: false,
                            ascii_only: true
                        },
                        warnings: false
                    }
                }),
                new OptimizeCssAssetsPlugin()
            ],
            splitChunks: {
                chunks: "all",
                minSize: 0,
                maxInitialRequests: 10,
                maxAsyncRequests: 10,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module, chunks, cacheGroupKey) {
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                            )[1];
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
        },
        devServer: {
            compress: true,
            historyApiFallback: true,
            open: true,
            overlay: true
        }
    };
};
