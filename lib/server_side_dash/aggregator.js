var fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , files = {}

var EndDash = module.exports = function(opts) {
  this.templateDir = opts.templateDirPath || "templates/"
  this.aggregatedFilesDir = opts.serveRoot || ""
  this.currentDir = this.templateDir
  this.files = files
  this.loadFiles()
}

Endash.prototype.loadFiles = function() {
  var fileNames = fs.readdir(this.templateDir, this.parseDirectory)
  if(fileNames.length == 0) {
    throw new Error("no templates found in " + this.templateDir)
  }
  this.parseDirectory(fileNames)
}

Endash.prototype.writeFiles = function() {
  var fd = fs.openSync(this.aggregatedFilesDir + "/EndDashTemplates.js", "w")
  _.each(Object.keys(files), function(fileName){
    var bytesWritten = fs.writeSync(fd, files.fileName)
  })
  fs.closeSync(fd)
}

Endash.prototype.parseDirectory = function(err, fileNames) { //Consider sym links and other odd cases

  _.each(fileNames, function(fileName) {
    if(fs.statSync(this.currentDir + fileName).isFile()){
      this.handleFile(fileName)
    } else {
      this.handleDirectory(fileName)
    }
  })

}

Endash.prototype.handleFile = function(fileName) {
  var path = this.pwd + fileName
  if (!this.files.path) {
    this.files.path = fs.readFileSync(path, 'utf8')
  }
}

Endash.prototype.handleDirectory = function(nextDir) {
  var lastPwd = this.pwd
  this.pwd = this.pwd + nextDir
  this.parseDirectory(fs.readdir(this.pwd))
  this.pwd = lastPwd
}