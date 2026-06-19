// eslint.config.js
import {defineConfig} from "eslint/config";
import react from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";

export default defineConfig([
  {
    files: ["**/*.js", "**/*.jsx"],
    ignores: ["./node/", "./node_modules/", "./target/"],
    languageOptions: {
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
      },
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 2020,
        sourceType: "module"
      },
    },
    plugins: {
      react: react
    },
    rules: {
      // TODO: indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"]
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
        }
      ],
      linkComponents: [
        "Hyperlink",
        {
          name: "Link",
          linkAttribute: "to"
        }
      ]
    }
  }
]);