module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.initConfig({
    simplemocha: {
      options: {
        globals: ['window', '$'],
        ui: 'bdd',
        reporter: 'spec'
      },

      dist: {src: ['test/**/*.js', '!test/support/**/*.js']}
    },

    watch: {
      dist: {
        files: ['test/**/*.js'],
        tasks: ['simplemocha']
      }
    },

    browserify: {
      dist: {
        files: {'build/end-dash.js': ['lib/end-dash.js']}
      }
    },

    uglify: {
      dist: {
        files: {'build/end-dash.min.js': ['build/end-dash.js']}
      }
    }
  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['browserify', 'uglify']);
  grunt.registerTask('test', ['simplemocha']);
};
