"use strict";

module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: [
    "html",
    "react"
  ],
  rules: {
    indent: [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    quotes: [
      "error",
      "double"
    ],
    semi: [
      "error",
      "always"
    ],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error"
  },
  settings: {
    react: {
      createClass: "createReactClass",
      pragma: "React",
      version: "detect",
      flowVersion: 0.53
    },
    propWrapperFunctions: [
      "forbidExtraProps",
      {
        property: "freeze",
        object: "Object"
      },
      {
        property: "myFavoriteWrapper"
      }
    ],
    linkComponents: [
      "Hyperlink",
      {
        name: "Link",
        linkAttribute: "to"
      }
    ]
  },
  ignorePatterns: [
    "coverage/**",
    "dist/**",
    "node/**",
    "node_modules/**"
  ],
  overrides: [
    {
      files: [
        "*.test.jsx"
      ],
      env: {
        jest: true
      }
    }
  ]
};