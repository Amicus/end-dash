var fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , files = {}

var EndDash = module.exports = function(opts) { //Account for leading / or not
  this.templateDir = this.pwd = opts.templateDir || "templates/"
  this.aggregatedFilesDir = opts.serveRoot || __dirname
  this.files = files
  this.loadFiles()
}

EndDash.prototype.loadFiles = function() {
  var fileNames = fs.readdirSync(this.templateDir)
  if(fileNames.length == 0) {
    throw new Error("no templates found in " + this.templateDir)
  }
  this.parseDirectory(fileNames)
  this.writeFiles()
}

EndDash.prototype.writeFiles = function() {
  var fd = fs.openSync(this.aggregatedFilesDir + "/EndDashTemplates.js", "w")
  _.each(Object.keys(files), function(fileName){
    var templateName = fileName.replace(/.*templates\//, "")
    fs.writeSync(fd, "\n <script type='EndDash' name='" + templateName + "' >")
    var bytesWritten = fs.writeSync(fd, files[fileName])
    fs.writeSync(fd, "\n </script>")
  })
  fs.closeSync(fd)
}

EndDash.prototype.parseDirectory = function(fileNames) { //Consider sym links and other odd cases
  var that = this
  _.each(fileNames, function(fileName) {
    if(fs.statSync(that.pwd + fileName).isFile()){
      that.handleFile(fileName)
    } else {
      that.handleDirectory(fileName)
    }
  })
}

EndDash.prototype.handleFile = function(fileName) {
  console.log(fileName)
  var path = this.pwd + fileName
  var normalizedName = path.replace(/(.js.ed$)|(.js$)|(.html$)/, "")
  if (!this.files[normalizedName]) {
    this.files[normalizedName] = fs.readFileSync(path, 'utf8')
  }
}

EndDash.prototype.handleDirectory = function(nextDirName) {
  var lastPwd = this.pwd
  this.pwd = this.pwd + nextDirName + "/"
  this.parseDirectory(fs.readdirSync(this.pwd))
  this.pwd = lastPwd
}