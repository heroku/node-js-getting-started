'use strict';

module.exports = function(grunt) {
  var testFiles = ['test/**/*.js'];

  var srcFiles = [
    '*.js',
    'models/**/*.js',
    'app/**/*.js',
    'routes/**/*.js'
  ].concat(testFiles);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');

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
    },

    clean: {
      dev: {
        src: ['public/']
      }
    },

    copy: {
      dev: {
        cwd: 'app/',
        src: ['**/*.html', '**/*.css'],
        expand: true,
        dest: 'public/'
      }
    },

    browserify: {
      dev: {
        src: ['app/js/**/*.js'],
        dest: 'public/script.js',
        options: {
          transform: ['debowerify']
        }
      }
    }
  });

  grunt.registerTask('style', ['jshint', 'jscs']);
  grunt.registerTask('test', ['style', 'simplemocha']);
  grunt.registerTask('public', ['clean:dev', 'copy:dev', 'browserify:dev']);
  grunt.registerTask('default',  ['test', 'public']);
};
