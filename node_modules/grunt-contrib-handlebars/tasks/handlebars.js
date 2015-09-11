/*
 * grunt-contrib-handlebars
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 Tim Branyen, contributors
 * Licensed under the MIT license.
 */

'use strict';
var chalk = require('chalk');
var nsdeclare = require('nsdeclare');

module.exports = function(grunt) {
  var _ = grunt.util._;

  // content conversion for templates
  var defaultProcessContent = function(content) { return content; };

  // AST processing for templates
  var defaultProcessAST = function(ast) { return ast; };

  // filename conversion for templates
  var defaultProcessName = function(name) { return name; };

  // filename conversion for partials
  var defaultProcessPartialName = function(filepath) {
    var pieces = _.last(filepath.split('/')).split('.');
    var name   = _(pieces).without(_.last(pieces)).join('.'); // strips file extension
    if (name.charAt(0) === '_') {
      name = name.substr(1, name.length); // strips leading _ character
    }
    return name;
  };

  var extractGlobalNamespace = function(nsDeclarations) {
    // Extract global namespace from any existing namespace declaration.
    // The purpose of this method is too fix an issue with AMD when using namespace as a function where the
    // nsInfo.namespace will contains the last namespace, not the global namespace.

    var declarations = _.keys(nsDeclarations);

    // no declaration found
    if (!declarations.length) {
      return '';
    }

    // In case only one namespace has been declared it will only return it.
    if (declarations.length === 1) {
      return declarations[0];
    }
    else {
      // we only need to take any declaration to extract the global namespace.
      // Another option might be find the shortest declaration which is the global one.
      var matches = declarations[0].match(/(this\[[^\[]+\])/g);
      return matches[0];
    }
  };

  grunt.registerMultiTask('handlebars', 'Compile handlebars templates and partials.', function() {
    var options = this.options({
      namespace: 'JST',
      separator: grunt.util.linefeed + grunt.util.linefeed,
      wrapped: true,
      amd: false,
      commonjs: false,
      knownHelpers: [],
      knownHelpersOnly: false
    });

    // assign regex for partials directory detection
    var partialsPathRegex = options.partialsPathRegex || /./;

    // assign regex for partial detection
    var isPartialRegex = options.partialRegex || /^_/;

    // assign transformation functions
    var processContent = options.processContent || defaultProcessContent;
    var processName = options.processName || defaultProcessName;
    var processPartialName = options.processPartialName || defaultProcessPartialName;
    var processAST = options.processAST || defaultProcessAST;
    var useNamespace = options.namespace !== false;

    // assign compiler options
    var compilerOptions = options.compilerOptions || {};
    var filesCount = 0;

    this.files.forEach(function(f) {
      var declarations = [];
      var partials = [];
      var templates = [];

      // Namespace info for current template
      var nsInfo;

      // Map of already declared namespace parts
      var nsDeclarations = {};

      // nsdeclare options when fetching namespace info
      var nsDeclareOptions = {response: 'details', declared: nsDeclarations};

      // Just get the namespace info for a given template
      var getNamespaceInfo = _.memoize(function(filepath) {
        if (!useNamespace) {return undefined;}
        if (_.isFunction(options.namespace)) {
          return nsdeclare(options.namespace(filepath), nsDeclareOptions);
        } else {
          return nsdeclare(options.namespace, nsDeclareOptions);
        }
      });

      // iterate files, processing partials and templates separately
      f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      })
      .forEach(function(filepath) {
        var src = processContent(grunt.file.read(filepath), filepath);

        var Handlebars = require('handlebars');
        var ast, compiled, filename;
        try {
          // parse the handlebars template into it's AST
          ast = processAST(Handlebars.parse(src));
          compiled = Handlebars.precompile(ast, compilerOptions);

          // if configured to, wrap template in Handlebars.template call
          if (options.wrapped === true) {
            compiled = 'Handlebars.template(' + compiled + ')';
          }
        } catch (e) {
          grunt.log.error(e);
          grunt.fail.warn('Handlebars failed to compile ' + filepath + '.');
        }

        // register partial or add template to namespace
        if (partialsPathRegex.test(filepath) && isPartialRegex.test(_.last(filepath.split('/')))) {
          filename = processPartialName(filepath);
          if (options.partialsUseNamespace === true) {
            nsInfo = getNamespaceInfo(filepath);
            if (nsInfo.declaration) {
              declarations.push(nsInfo.declaration);
            }
            partials.push('Handlebars.registerPartial(' + JSON.stringify(filename) + ', ' + nsInfo.namespace +
              '[' + JSON.stringify(filename) + '] = ' + compiled + ');');
          } else {
            partials.push('Handlebars.registerPartial(' + JSON.stringify(filename) + ', ' + compiled + ');');
          }
        } else {
          if (options.amd && !useNamespace) {
            compiled = 'return ' + compiled;
          }
          filename = processName(filepath);
          if (useNamespace) {
            nsInfo = getNamespaceInfo(filepath);
            if (nsInfo.declaration) {
              declarations.push(nsInfo.declaration);
            }
            templates.push(nsInfo.namespace + '[' + JSON.stringify(filename) + '] = ' + compiled + ';');
          } else if (options.commonjs === true) {
            templates.push('templates[' + JSON.stringify(filename) + '] = ' + compiled + ';');
          } else {
            templates.push(compiled);
          }
        }
      });

      var output = declarations.concat(partials, templates);
      if (output.length < 1) {
        grunt.log.warn('Destination not written because compiled files were empty.');
      } else {
        if (useNamespace) {
          if (options.node) {
            output.unshift('Handlebars = glob.Handlebars || require(\'handlebars\');');
            output.unshift('var glob = (\'undefined\' === typeof window) ? global : window,');

            var nodeExport = 'if (typeof exports === \'object\' && exports) {';
            nodeExport += 'module.exports = ' + nsInfo.namespace + ';}';

            output.push(nodeExport);
          }

        }

        if (options.amd) {
          // Wrap the file in an AMD define fn.
          if (typeof options.amd === 'boolean') {
            output.unshift('define([\'handlebars\'], function(Handlebars) {');
          } else if (typeof options.amd === 'string') {
            output.unshift('define([\'' + options.amd + '\'], function(Handlebars) {');
          } else if (Array.isArray(options.amd)) {
            // convert options.amd to a string of dependencies for require([...])
            var amdString = '';
            for (var i = 0; i < options.amd.length; i++) {
              if (i !== 0) {
                amdString += ', ';
              }

              amdString += '\'' + options.amd[i] + '\'';
            }

            // Wrap the file in an AMD define fn.
            output.unshift('define([' + amdString + '], function(Handlebars) {');
          }

          if (useNamespace) {
            // Namespace has not been explicitly set to false; the AMD
            // wrapper will return the object containing the template.
            output.push('return ' + extractGlobalNamespace(nsDeclarations) + ';');
          }
          output.push('});');
        }

        if (options.commonjs) {
          if (useNamespace) {
            output.push('return ' + nsInfo.namespace + ';');
          } else {
            output.unshift('var templates = {};');
            output.push('return templates;');
          }
          // Export the templates object for CommonJS environments.
          output.unshift('module.exports = function(Handlebars) {');
          output.push('};');
        }

        filesCount++;
        grunt.file.write(f.dest, output.join(grunt.util.normalizelf(options.separator)));
        grunt.verbose.writeln('File ' + chalk.cyan(f.dest) + ' created.');
      }
    });

    grunt.log.ok(filesCount + ' ' + grunt.util.pluralize(filesCount, 'file/files') + ' created.');

  });

};
