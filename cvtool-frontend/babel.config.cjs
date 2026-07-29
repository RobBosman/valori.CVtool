// This file must be CommonJS, so .cjs, see https://stackoverflow.com/questions/61257559/using-native-ecmascript-modules-in-babeljs-config
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { esmodules: true } }],
    ["@babel/preset-react", { runtime: "automatic" }]
  ]
};