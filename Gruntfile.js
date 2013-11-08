module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerMultiTask('write-component', 'write new files to component.json file list', function() {
    var componentFile = grunt.file.readJSON('component.json')
    componentFile.scripts = this.files.map(function(f) {
      return f.src[0]
    })
    grunt.file.write('component.json', JSON.stringify(componentFile, null, 2))
  })

  grunt.initConfig({
    'write-component': {
      files: {
        expand: true,
        cwd: 'lib/',
        src: ['**/*.js', 'index.js'],
      }
    },
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
