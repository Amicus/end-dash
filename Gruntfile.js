module.exports = function(grunt) {

  grunt.registerMultiTask('write-component', 'write new files to component.json file list', function() {
    var componentFile = grunt.file.readJSON('component.json')
    componentFile.scripts = this.files[0].src
    grunt.file.write('component.json', JSON.stringify(componentFile, null, 2))
  })

  grunt.initConfig({
    "write-component": {
      files: ["lib/**/*.js"]
    }
  })
}