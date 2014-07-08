module.exports = function (grunt) {
  var filename = "leap.playback-<%= pkg.version %>";
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    connect: {
      server: {
       options: {
         base: '',
         keepalive: false
       }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: ['javascripts/*.js'],
        tasks: [],
        options: {
          spawn: false,
          livereload: true
        }
      },
      css: {
        files: ['stylesheets/*'],
        tasks: ['sass'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      html: {
        files: ['*.html', 'examples/*.html'],
        tasks: [],
        options: {
          spawn: false,
          livereload: true
        }
      },
      images: {
        files: ['images/*', 'textures/*'],
        tasks: [],
        options: {
          spawn: false,
          livereload: true
        }
      }
    },
    sass: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'stylesheets/',
            src: ['*.scss'],
            dest: 'stylesheets/',
            ext: '.css'
          }
        ]
      }
    }
  });
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-devtools')
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('dev', ['connect', 'watch'])
  return grunt.registerTask('default', ['sass']);
};
