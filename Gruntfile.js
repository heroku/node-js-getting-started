'use strict';

module.exports = function(grunt) {
  var testFiles = ['test/**/*.js'];

  var srcFiles = [
    '*.js',
    'models/**/*.js',
    'public/**/*.js',
    'routes/**/*.js'
  ].concat(testFiles);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.initConfig({
    simplemocha: {
      src: testFiles
    },

    jshint: {
      files: srcFiles,
      options: {
        jshintrc: true
      }
    },

    jscs: {
      src: srcFiles,
      options: {
        preset: 'google'
      }
    }
  });

  grunt.registerTask('style', ['jshint', 'jscs']);
  grunt.registerTask('test', ['style', 'simplemocha']);
  grunt.registerTask('default',  ['test']);
};
