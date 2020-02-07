"use strict";

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const Path = require("path");

module.exports = (_env, argv) => {
    const isProduction = argv.mode === "production";
    return {
        devtool: !isProduction && "cheap-module-source-map",
        entry: Path.resolve(__dirname, "src", "app.js"),
        output: {
            path: Path.resolve(__dirname, "dist"),
            filename: "js/[name].[contenthash:8].js",
            publicPath: "/"
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "css/[name].[contenthash:8].css",
                chunkFilename: "css/[name].[contenthash:8].chunk.css"
            }),
            new HtmlWebpackPlugin({
                template: Path.resolve(__dirname, "src", "static", "index.html"),
                inject: true,
                favicon: Path.resolve(__dirname, "src", "static", "favicon.ico")
            }),
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development")
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(dist|node|node_modules)/,
                    use: {
                        loader: require.resolve("babel-loader"),
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        modules: false
                                    }
                                ],
                                "@babel/preset-react"
                            ],
                            plugins: [
                                "@babel/plugin-transform-runtime",
                                "@babel/plugin-syntax-dynamic-import",
                                "@babel/plugin-proposal-class-properties",
                                "@babel/plugin-proposal-object-rest-spread"
                            ],
                            envName: isProduction ? "production" : "development",
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
                                        "@babel/plugin-transform-react-inline-elements",
                                        "@babel/plugin-transform-react-constant-elements"
                                    ]
                                }
                            },
                            cacheDirectory: true,
                            cacheCompression: false
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : require.resolve("style-loader"),
                        require.resolve("css-loader")
                    ]
                },
                {
                    test: /\.module\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : require.resolve("style-loader"),
                        {
                            loader: require.resolve("css-loader"),
                            options: {
                                modules: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(sass|scss)$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : require.resolve("style-loader"),
                        {
                            loader: require.resolve("css-loader"),
                            options: {
                                importLoaders: 2
                            }
                        },
                        require.resolve("resolve-url-loader"),
                        {
                            loader: require.resolve("sass-loader"),
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
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
        optimization: {
            minimize: isProduction,
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
                maxInitialRequests: 30,
                maxAsyncRequests: 30,
                maxSize: 100000,
                cacheGroups: {
                    defaultVendors: {
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