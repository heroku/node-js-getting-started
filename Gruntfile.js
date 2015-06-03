module.exports = function (grunt) {

    var config = grunt.file.readJSON('config_app.json');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,

        // JS HINT
        jshint: {
            all: ['Gruntfile.js', '<%= config.app_path %>/**/*.js', '!<%= config.app_path %>/**/_*.js' ],
            options: {
                force: true,
                reporter: require('jshint-stylish')
            }
        },

        // CLEAN USELESS FILES ON BUILD PROJECT
        clean: {
            sourceMap: ["<%= config.public_path %>/**/*.map"],
            tmp: ["<%= config.tmp_path %>/*"]
        },

        // FOR DEV APP FILES AND VENDOR FILES JS
        uglify: {
            options: {
                mangle: true,
                sourceMap: true,
                compress: true,
                preserveComments: false,
                force: true
            },
            uglify_vendor_files: {
                '<%= config.public_path %>/<%= config.js_dir %>/vendor.js': [
                    // BEFORE
                    '<%= config.tmp_path %>/_bower.js',
                    '<%= config.tmp_path %>/_handlebars.js',

                    // ALL
                    '<%= config.vendor_path %>/**/*.js',
                    '!<%= config.vendor_path %>/**/_*.js', // IGNORED
                    '!<%= config.vendor_path %>/bower_components/**/*'

                    // AFTER
                ]
            },

            uglify_dev_files: {
                "<%= config.public_path %>/<%= config.js_dir %>/scripts.js": [
                    '<%= config.app_path %>/**/*.js',
                    '!<%= config.app_path %>/**/_*.js' // IGNORED
                ]
            },
            dev_vendor: {
                options: {
                    compress: {
                        warnings: true
                    }
                },
                files: '<%= uglify.uglify_vendor_files %>'
            },
            dev_app: {
                options: {
                    compress: {
                        warnings: true
                    }
                },
                files: '<%= uglify.uglify_dev_files %>'
            },
            // ONLY VENDORS
            prod: {
                options: {
                    sourceMap: false,
                    compress: {
                        drop_console: true,
                        warnings: false
                    }
                },
                files: '<%= uglify.uglify_vendor_files %>'
            }
        },

        // CONCATENATION FOR BOWER COMPONENTS
        bower_concat: {
            dev: {
                dest: '<%= config.tmp_path %>/_bower.js',
                cssDest: '<%= config.public_path%>/<%= config.css_dir %>/vendor.css',
                exclude: [
                    'almond'
                ],
                dependencies: config.bower_dependencies,
                mainFiles: config.bower_main_files,
                bowerOptions: {
                }
            },
            prod: {
                dest: '<%= config.tmp_path %>/_bower.js',
                cssDest: '<%= config.public_path%>/<%= config.css_dir %>/vendor.css',
                exclude: [
                    'requirejs',
                    'almond'
                ],
                dependencies: config.bower_dependencies,
                mainFiles: config.bower_main_files,
                bowerOptions: {
                }
            }
        },

        // APP FILES FOR BUILD ONLY
        requirejs: {
            compile: {
                options: {
                    baseUrl: "<%= config.app_path %>",
                    include: "<%= config.require_include_modules %>",
                    name: "../vendor/bower_components/almond/almond", // assumes a production build using almond
                    out: "<%= config.public_path %>/<%= config.js_dir %>/scripts.js",
                    optimize: "uglify2",
                    generateSourceMaps: false,
                    preserveLicenseComments: false,
                    findNestedDependencies: true
                }
            }
        },

        // SASS FILES
        sass: {
            dist: {
                options: {
                    sourcemap: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.sass_path %>',
                        src: ['**/*.scss'],
                        dest: '<%= config.public_path %>/<%= config.css_dir %>/',
                        ext: '.css'
                    }
                ]
            }
        },

        // HANDLEBARS FILES
        handlebars: {
            compile: {
                options: {
                    namespace: "<%= config.handlebars_template_container %>",
                    processName: function(filePath) {
                        return filePath.replace(new RegExp(config.app_path+"\/(.*).hbs"), "$1");
                    }
                },
                files: {
                    "<%= config.tmp_path %>/_handlebars.js": "<%= config.app_path %>/**/*.hbs"
                }
            }
        },

        // WEB SERVER HTML
        connect: {
            dev: {
                options: {
                    protocol: "<%= config.protocole %>",
                    hostname: "<%= config.hostname %>",
                    port: "<%= config.port %>",
                    base: "<%= config.public_path %>",
                    livereload: true,
                    open: true
                }
            }
        },

        // WEB SERVER PHP
        php: {
            dev: {
                options: {
                    base: "<%= config.public_path %>",
                    keepalive: true,
                    open: true,
                    hostname: "<%= config.hostname %>",
                    port: "<%= config.port %>"
                }
            }
        },

        // WATCHER
        watch: {
            config: {
                files: ['Gruntfile.js', "config_app.json"],
                options: {
                    reload: true
                }
            },
            scripts: {
                files: ['<%= config.app_path %>/**/*.js'],
                tasks: ['jshint', 'uglify:dev_app'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            sass: {
                files: ['<%= config.sass_path %>/**/*.scss'],
                tasks: ['sass']
            },
            handlebars: {
                files: ['<%= config.app_path %>/**/*.hbs'],
                tasks: ['handlebars', 'uglify:dev_vendor'],
                livereload: true
            },
            css: {
                files: ['<%= config.public_path %>/**/*.css'],
                options: {
                    // To use with external server, copy/paste the next script tag
                    // <script src="//localhost:35729/livereload.js"></script>
                    livereload: true
                }
            },
            vendor: {
                files: ['<%= config.vendor_path %>/**/*.js', '<%= config.vendor_path %>/**/*.css'],
                tasks: ['bower_concat', 'uglify:dev_vendor'],
                options: {
                    spawn: false,
                    livereload: true
                }
            }
        }
    });

    // LOAD GRUNT NPM TASKS
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-php');


    // REGISTER TASKS
    // $ grunt // Will trigger "default" task
    // $ grunt compile // Will trigger "compile" task
    // which perform "jshint", "sass", "uglify", "requirejs" tasks

    grunt.registerTask('compile', ["jshint", "bower_concat:prod", "handlebars", "uglify:prod", "requirejs", "clean"]);
    grunt.registerTask('watch_tasks', ["jshint", "bower_concat:dev", "handlebars", "uglify:dev_vendor", "uglify:dev_app"]);
    grunt.registerTask('watch_php', ["watch_tasks", "php", "watch"]);
    grunt.registerTask('watch_server', ["watch_tasks", "watch"]);
    grunt.registerTask('watch_no_server', ["watch_tasks", "watch"]);
    grunt.registerTask('default', ["watch_server"]);

};
