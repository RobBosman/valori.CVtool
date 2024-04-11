export default [
  {
    files: [
      "**/*.js",
      "**/*.jsx",
      "**/*.html"
    ],
    ignores: [
      "node/**",
      "node_modules/**",
      "target/**"
    ],
    languageOptions: {
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
      }
    },
    plugins: {
      html: import("html-webpack-plugin"),
      react: "react"
    },
    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
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
];