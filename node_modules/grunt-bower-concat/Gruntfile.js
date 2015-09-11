/*jshint node:true*/
module.exports = function(grunt) {
	'use strict';

	var _ = require('lodash');

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		bower_concat: {
			basic: {
				dest: 'test/tmp/basic.js',
				exclude: 'jquery',
				dependencies: {
					'backbone': 'underscore',
					'jquery-mousewheel': 'jquery'
				},
				mainFiles: {
				  'svg.js': 'dist/svg.js'
				}
			},
			nonrelative: {
				dest: 'test/tmp/nonrelative.js',
				exclude: 'jquery',
				dependencies: {
					'backbone': 'underscore',
					'jquery-mousewheel': 'jquery'
				},
				mainFiles: {
				  'svg.js': 'dist/svg.js'
				},
				bowerOptions: {
					relative: false
				}
			},
			callback: {
				dest: 'test/tmp/callback.js',
				exclude: 'jquery',
				dependencies: {
					'backbone': 'underscore',
					'jquery-mousewheel': 'jquery'
				},
				mainFiles: {
				  'svg.js': 'dist/svg.js'
				},
				callback: function(mainFiles, component) {
					return _.map(mainFiles, function(filepath) {
						var min = filepath.replace(/\.js$/, '.min.js');
						return grunt.file.exists(min) ? min : filepath;
					});
				}
			},
			withCss: {
				dest: 'test/tmp/with-css.js',
				cssDest: 'test/tmp/with-css.css',
				exclude: 'jquery',
				dependencies: {
					'backbone': 'underscore',
					'jquery-mousewheel': 'jquery'
				},
				mainFiles: {
				  'svg.js': 'dist/svg.js',
				  'social-likes': ['social-likes.min.js', 'social-likes.css']
				}
			},
			onlyCss: {
				cssDest: 'test/tmp/with-css.css',
				exclude: 'svg.js',
				mainFiles: {
				  'social-likes': ['social-likes.css']
				}
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/*.js']
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'tasks/**/*.js',
				'lib/**/*.js'
			],
		},
		jscs: {
			all: [
				'tasks/**/*.js',
				'lib/**/*.js'
			],
		},
		clean: ['test/tmp']
	});

	grunt.loadTasks('tasks');

	grunt.registerTask('test', ['mochaTest']);
	grunt.registerTask('default', ['jshint', 'jscs', 'clean', 'bower_concat', 'test', 'clean']);
	grunt.registerTask('build', ['default']);
};
