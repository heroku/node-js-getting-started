/*
 * grunt-contrib-sass
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 */
'use strict';
var path = require('path');
var dargs = require('dargs');
var numCPUs = require('os').cpus().length || 1;
var async = require('async');
var chalk = require('chalk');
var spawn = require('win-spawn');
var which = require('which');

module.exports = function (grunt) {
  var bannerCallback = function (filename, banner) {
    grunt.verbose.writeln('Writing CSS banner for ' + filename);
    grunt.file.write(filename, banner + grunt.util.linefeed + grunt.file.read(filename));
  };

  var checkBinary = function (cmd, errMess) {
    try {
      which.sync(cmd);
    } catch (err) {
      return grunt.warn(
        '\n' + errMess + '\n' +
        'More info: https://github.com/gruntjs/grunt-contrib-sass\n'
      );
    }
  };

  grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {
    var cb = this.async();
    var options = this.options();
    var bundleExec = options.bundleExec;
    var banner;
    var passedArgs;

    if (bundleExec) {
      checkBinary('bundle',
        'bundleExec options set but no Bundler executable found in your PATH.'
      );
    } else {
      checkBinary('sass',
        'You need to have Ruby and Sass installed and in your PATH for this task to work.'
      );
    }

    // Unset banner option if set
    if (options.banner) {
      banner = options.banner;
      delete options.banner;
    }

    passedArgs = dargs(options, ['bundleExec']);

    async.eachLimit(this.files, numCPUs, function (file, next) {
      var src = file.src[0];

      if (typeof src !== 'string') {
        src = file.orig.src[0];
      }

      if (!grunt.file.exists(src)) {
        grunt.log.warn('Source file "' + src + '" not found.');
        return next();
      }

      if (path.basename(src)[0] === '_') {
        return next();
      }

      var args = [
        src,
        file.dest
      ].concat(passedArgs);

      var bin = 'sass';

      if (bundleExec) {
        bin = 'bundle';
        args.unshift('exec', 'sass');
      }

      // If we're compiling scss or css files
      if (path.extname(src) === '.css') {
        args.push('--scss');
      }

      // Make sure grunt creates the destination folders if they don't exist
      if(!grunt.file.exists(file.dest)) {
        grunt.file.write(file.dest, '');
      }

      grunt.verbose.writeln('Command: ' + bin + ' ' + args.join(' '));

      var cp = spawn(bin, args, {stdio: 'inherit'});

      cp.on('error', function (err) {
        grunt.warn(err);
      });

      cp.on('close', function (code) {
        if (code > 0) {
          return grunt.warn('Exited with error code ' + code);
        }

        // Callback to insert banner
        if (banner) {
          bannerCallback(file.dest, banner);
        }

        grunt.verbose.writeln('File ' + chalk.cyan(file.dest) + ' created.');
        next();
      });
    }, cb);
  });
};
