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

      all: {src: ['test/**/*.js', '!test/support/**/*.js']}
    },

    watch: {
      all: {
        files: ['test/**/*.js'],
        tasks: ['simplemocha']
      }
    }
  });

  grunt.registerTask('default', ['simplemocha']);
};
