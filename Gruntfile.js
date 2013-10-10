module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.initConfig({
    simplemocha: {
      options: {
        globals: ['window', '$'],
        ui: 'bdd',
        reporter: 'spec'
      },

      all: {src: ['test/**/*.js']}
    },

    watch: {
      all: {
        files: ['test/**/*.js'],
        tasks: ['simplemocha'],
        options: {spawn: false}
      }
    }
  });

  // Only run tests for the changed files. See:
  // https://github.com/gruntjs/grunt-contrib-watch#compiling-files-as-needed
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('simplemocha.all.src', filepath);
  });

  grunt.registerTask('default', ['simplemocha']);
};
