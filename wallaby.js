var babel = require('babel');
var wallabyWebpack = require('wallaby-webpack');

var webpackPostprocessor = wallabyWebpack({});

module.exports = function () {

  return {
    files: [
      {pattern: 'test/phantomPolyfill.js', instrument: false},
      {pattern: 'node_modules/react/dist/react-with-addons.js', instrument: false},
      'assets/**',

      { pattern: 'src/**/*.js', load: false },
      { pattern: 'src/**/*.jsx', load: false }
    ],

    tests: [
      {pattern: 'test/*Spec.js', load: false },
      {pattern: 'test/*Spec.jsx', load: false}
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
