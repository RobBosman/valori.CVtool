# CVtool

# React + Redux Application

see
* https://reactjs.org/docs/getting-started.html
* https://gist.github.com/eirikb/06f92fd3857063b58512

npm config set proxy http://USER:PASSWORD@giba-proxy.wps.ing.net:8080
npm config set https-proxy https://USER:PASSWORD@giba-proxy.wps.ing.net:8080
npm config set strict-ssl false
npm config set registry "http://registry.npmjs.org/"
npm --without-ssl --insecure install

1. npm init -y
1. npm install babel-cli@6 babel-preset-react-app@3
1. npx babel --watch src --out-dir prod/js --presets react-app/prod

Visual Studio Code
* MarkdownLint
* Babel JavaScript