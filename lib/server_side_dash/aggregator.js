var fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , files = {}

var EndDash = module.exports = function(opts) { //Account for leading / or not
  this.templateDir = opts.templateDir || "templates/"
  this.aggregatedFilesDir = opts.serveRoot || ""
  this.currentDir = this.templateDir
  this.files = files
  this.loadFiles()
}

EndDash.prototype.loadFiles = function() {
  var fileNames = fs.readdirSync(this.templateDir, this.parseDirectory)
  if(fileNames.length == 0) {
    throw new Error("no templates found in " + this.templateDir)
  }
  this.parseDirectory(fileNames)
}

EndDash.prototype.writeFiles = function() {
  var fd = fs.openSync(this.aggregatedFilesDir + "/EndDashTemplates.js", "w")
  _.each(Object.keys(files), function(fileName){
    fs.writeSync(fd, "\n <script type='EndDash' name='" + fileName + "' >")
    var bytesWritten = fs.writeSync(fd, files.fileName)
    fs.writeSync(fd, "\n </script>")
  })
  fs.closeSync(fd)
}

EndDash.prototype.parseDirectory = function(err, fileNames) { //Consider sym links and other odd cases

  _.each(fileNames, function(fileName) {
    if(fs.statSync(this.currentDir + fileName).isFile()){
      this.handleFile(fileName)
    } else {
      this.handleDirectory(fileName)
    }
  })

}

EndDash.prototype.handleFile = function(fileName) {
  var path = this.pwd + fileName
  if (!this.files.path) {
    this.files.path = fs.readFileSync(path, 'utf8')
  }
}

EndDash.prototype.handleDirectory = function(nextDir) {
  var lastPwd = this.pwd
  this.pwd = this.pwd + nextDir
  this.parseDirectory(fs.readdirSync(this.pwd))
  this.pwd = lastPwd
}