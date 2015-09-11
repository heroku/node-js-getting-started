module.exports = function (grunt) {

	"use strict";

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		meta: {
			banner: "/*!\n * <%= pkg.name %>\n * <%= pkg.description %>\n * @version <%= pkg.version %> - <%= grunt.template.today(\'yyyy-mm-dd\') %>\n * @author <%= pkg.author.name %> <<%= pkg.author.url %>>\n */\n"
		},
		jshint: {
			all: {
				src: ["lib/*.js", "test/*.js", "samples/**/*.js", "lib/resources/*.js"],
				options: {
					jshintrc: ".jshintrc"
				}
			}
		},
		simplemocha: {
			options: {
				timeout: 15000,
				reporter: 'dot'
			},
			all: {
				src: 'test/*.js'
			}
		},
		jsdoc : {
			dist : {
				src: ['lib/*'],
				jsdoc: './node_modules/.bin/jsdoc',
				options: {
					destination: 'docs/jsdoc/',
					configure: './node_modules/jsdoc/conf.json',
					template: './node_modules/ink-docstrap/template'
				}
			}
		}
	});

	// Load grunt tasks from npm packages
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-jsdoc');

	// Test task
	grunt.registerTask("test", ["simplemocha"]);

	// Default task.
	grunt.registerTask("default", ["jshint", "simplemocha"]);

};