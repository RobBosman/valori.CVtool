"use strict";

module.exports = (api) => {

  const isTest = api.env("test");

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          modules: isTest ? "auto" : false,
          targets: {
            node: "current"
          }
        }
      ],
      "@babel/preset-react"
    ],
    plugins: [
      "@babel/plugin-transform-runtime",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-object-rest-spread"
    ]
  };
};