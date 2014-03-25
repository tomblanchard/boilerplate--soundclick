module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({




    /**
     * Start server.
     */
    connect: {
      server: {
        options: {
          port: 9999,
          base: 'site',
          hostname: '*',
          middleware: function(connect, opts) {
            return [
              require('connect-livereload')(),
              connect.static(require('path').resolve(__dirname + '/site'))
            ];
          }
        }
      }
    },


    /**
     * Compile Sass from `src/scss` to `src/css`.
     */
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'src/scss',
          src: ['**/*.scss'],
          dest: 'site/lib/css',
          ext: '.css'
        }]
      }
    },


    /**
     * Autoprefix compiled CSS.
     */
    autoprefixer: {
      options: {
        browsers: [
          'last 5 version',
          'safari 6',
          'ie 9',
          'opera 12.1',
          'ios 6',
          'android 4'
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'site/lib/css',
          src: ['**/*.css'],
          dest: 'site/lib/css'
        }]
      }
    },


    /**
     * Delete all `.html` files from `site`.
     */
    clean: {
      html: { src: ['site/**/*.html'] }
    },


    /**
     * Compile site `.html` files (excluding includes) from `templates` to `site`.
     */
    includes: {
      dist: {
        cwd: 'src/templates',
        src: ['**/*.html', '!includes/**/*'],
        dest: 'site',
        options: {
          flatten: true,
          includeRegexp: /^(\s*){% include\s+"(\S+)" %}\s*$/,
          includePath: 'src/templates/includes'
        }
      }
    },


    /**
     * Runs tasks against changed watched files.
     */
    watch: {
      /**
       * Watch `.html` files: delete all `.html` files from `site` then re-compile site .
       */
      html: {
        files: 'src/templates/**/*.html',
        tasks: ['clean:html', 'includes:dist'],
        options: {
          spawn: false,
          livereload: true
        }
      },

      /**
       * Watch Sass files: re-compile them to CSS then re-autoprefix the CSS.
       */
      sass: {
        files: 'src/scss/**/*.scss',
        tasks: ['sass:dist', 'autoprefixer:dist'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }




  });

  grunt.registerTask('default', [
    'connect',
    'sass:dist',
    'autoprefixer:dist',
    'includes:dist',
    'watch'
  ]);

};