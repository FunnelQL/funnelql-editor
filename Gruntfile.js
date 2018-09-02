/* global module:false */
module.exports = function(grunt) {

    var CLOSURE_COMPILER_PATH = '../../closure-compiler/'; // ./build/compiler.jar

    // custom grunt closure-compiler
    require('./grunt-closure-compiler')(grunt);

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // IIFE
        iife: {
            "funnelql-editor": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window'],
                    params: ['win']
                },
                files: {
                    'iife/funnelql-editor.js': [
                        'src/global.js',
                        'src/buttons.js',
                        'src/constructor.js',
                        'src/public.js'
                    ]
                }
            }
        },

        // minify
        uglify: {
            "funnelql-editor": {
                options: {
                    properties: true,
                    dead_code: true,
                    join_vars: true,
                    compress: {
                        global_defs: {

                        }
                    },
                    mangle: {
                        keep_fnames: true
                    },
                    banner: ''
                },
                files: [{
                    expand: true,
                    src: [
                        'funnelql-editor.js'
                    ],
                    dest: 'min',
                    cwd: 'iife/'
                }]
            },

            // CodeMirror Javascript editor source code
            codemirror: {
                options: {
                    compress: {

                    },
                    banner: ''
                },
                files: {
                    'min/funnelql-codemirror.js': [
                        'node_modules/codemirror/lib/codemirror.js',
                        'node_modules/codemirror/addon/lint/lint.js',
                        'src/codemirror-funnelql-mode.js',
                        'src/codemirror-funnelql-lint.js'
                    ]
                }
            }
        },

        // closure compiler
        'closure-compiler': {
            "funnelql-editor": {
                closurePath: CLOSURE_COMPILER_PATH,
                js: 'min/funnelql-editor.js',
                jsOutputFile: 'dist/funnelql-editor.js',
                noreport: true,
                maxBuffer: 2500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: ['./ext.funnelql.js', './ext.funnelql-editor.js', './ext.codemirror.js']
                }
            },
            "codemirror": {
                closurePath: CLOSURE_COMPILER_PATH,
                js: 'min/funnelql-codemirror.js',
                jsOutputFile: 'dist/funnelql-codemirror.js',
                noreport: true,
                maxBuffer: 2500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: ['./ext.funnelql.js', './ext.funnelql-editor.js', './ext.codemirror.js']
                }
            }
        },

        // CSS
        cssmin: {

            editor: {
                options: {
                    banner: '/*! FunnelQL Editor v<%= pkg.version %>\n * (c) https://funnelql.com/ */\n',
                    advanced: true,
                    aggressiveMerging: true,
                    processImport: true
                },
                files: {

                    // control panel
                    'dist/funnelql-editor.css': [
                        'node_modules/codemirror/lib/codemirror.css',
                        'node_modules/codemirror/addon/lint/lint.css',
                        'src/funnelql-editor.css',
                        'src/icomoon/style.css'
                    ],

                }
            }
        },

        // add header
        header: {
            editor: {
                options: {
                    text: '/*! FunnelQL Editor v<%= pkg.version %>\n * (c) https://funnelql.com/ */'
                },
                files: [{
                    expand: true,
                    src: 'dist/funnelql-editor.js',
                    dest: ''
                }]
            },
            editor_css: {
                options: {
                    text: '/*! FunnelQL Editor v<%= pkg.version %>\n * (c) https://funnelql.com/ */'
                },
                files: [{
                    expand: true,
                    src: 'dist/funnelql-editor.css',
                    dest: ''
                }]
            },
            codemirror: {
                options: {
                    text: '/*! CodeMirror + FunnelQL Lint\n * CodeMirror (c) http://codemirror.net/\n * FunnelQL (c) https://funnelql.com/ */'
                },
                files: [{
                    expand: true,
                    src: 'dist/funnelql-codemirror.js',
                    dest: ''
                }]
            }
        },

        // combine codemirror + editor
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'dist/funnelql-codemirror.js',
                    'dist/funnelql-editor.js'
                ],
                dest: 'dist/funnelql-editor+codemirror.js',
            },
        },

        copy: {
            fonts: {
                expand: true,
                cwd: 'src/icomoon/fonts',
                src: '**',
                dest: 'dist/fonts/',
                flatten: true,
                filter: 'isFile',
            },
        }
    });

    // Load Dependencies
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('build', [
        'iife',
        'uglify',
        'closure-compiler',
        'header:editor',
        'header:codemirror',
        'css',
        'concat'
    ]);

    grunt.registerTask('editor', [
        'iife',
        'uglify:funnelql-editor',
        'closure-compiler:funnelql-editor',
        'header:editor',
        'header:codemirror',
        'concat'
    ]);

    grunt.registerTask('css', [
        'cssmin',
        'header:editor_css',
        'copy:fonts'
    ]);

    grunt.registerTask('default', ['build']);
};