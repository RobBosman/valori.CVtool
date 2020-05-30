/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = (config) => {
  config.set(
    merge(createDefaultConfig(config), {
      listenAddress: '127.0.0.1',
      hostname: '127.0.0.1',
      reporters: ['junit'],
      coverageIstanbulReporter: {
        thresholds: {
          global: {
            statements: 80,
            lines: 80,
            branches: 80,
            functions: 80
          }
        }
      },
      junitReporter: {
        outputFile: 'test-results.xml'
      },
      files: [
        'karma.init.js',
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : 'src/**/*.test.js*', type: 'module' },
        { pattern: 'MOCK/**', watched: false, included: false, served: true, nocache: false }
      ],
      proxies: {
        '/MOCK/': 'MOCK/'
      },
      esm: {
        // if you are using 'bare module imports' you will need this option
        nodeResolve: true,
        babel: true
      },
      browserNoActivityTimeout: 600000, // 10 minutes
      logLevel: config.LOG_LOG
    })
  );
  return config;
};
