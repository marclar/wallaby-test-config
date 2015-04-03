var babel = require('babel');
var wallabyWebpack = require('wallaby-webpack');

var webpackPostprocessor = wallabyWebpack({});

module.exports = function () {

  return {
    files: [
      { pattern: 'src/*.js', load: false },

      {pattern: 'test/phantomPolyfill.js', instrument: false},
      {pattern: 'node_modules/react/dist/react-with-addons.js', instrument: false},
      'assets/**',
      'src/jsx/app/components/**'
    ],

    tests: [
      {pattern: 'test/*Spec.js', load: false },
      {pattern: 'test/*Spec.jsx'}
    ],

    preprocessors: {
      '**/*.js': file => babel.transform(file.content, { sourceMap: true }),
      '**/*.jsx': file => require('react-tools').transformWithDetails(file.content, {sourceMap: true, harmony: true})
    },

    postprocessor: webpackPostprocessor,

    bootstrap: function () {
      window.__moduleBundler.loadTests();
    }
  };
};
