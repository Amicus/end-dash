var fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , outputPath = __dirname
  , filesToParse = 0
  , callback

var compressFiles = function(templatesLocation, outputPath, callback) {
  if (arguments.length != 3) {
    throw new Error("All three arugments are required")
  }
  var templatesLocation = addLeadingSlash(templatesLocation)
    , ws = fs.createWriteStream(addLeadingSlash(outputPath) + "end_dash_templates.js", "w")
    , callback = callback
  traverseFilesSync(templatesLocation, null, function(){filesToParse++})
  traverseFilesSync(templatesLocation, null, readAndWriteFile_curry(ws, callback))
}

var traverseFilesSync = function(dir, dirCallback, fileCallback) {
  var files = fs.readdirSync(dir)
  _.each(files, function(fileName) {
    if(fs.statSync(dir + fileName).isFile()){
        if (fileName.match(/.*.js.ed\s*$/) || fileName.match(/.*.html\s*$/) ) {
          fileCallback && fileCallback(dir, fileName)
        }
    } else {
      dirCallback && dirCallback(dir, fileName)
      traverseFilesSync(dir + fileName + "/", dirCallback, fileCallback)
    }
  })
}

var readAndWriteFile_curry = function(ws, callback) {
  return function(dir, fileName) {
    fs.readFile(dir + fileName, "utf-8", writeCallback_curry(ws, dir + fileName, callback))
  }
}

var writeCallback_curry = function(ws, path, callback) {
  return function(err, bytesRead, buffer) {
    var templateName = normalizeTemplateName(path)
    var toWrite = "<script type='EndDash' name='" + templateName + "' >\n" +
                  bytesRead +
                  "\n</script>\n"
    ws.write(toWrite, 'utf8', checkIwsone_curry(callback))
  }
}

var checkIwsone_curry = function(callback) {
  return function() {
    filesToParse--
    if (filesToParse == 0){
      callback()
    }
  }
}

var addLeadingSlash = function(path){
  if (!path){
    return
  }
  if (path[path.length-1] != "/") {
    path = path + "/"
  }
  return path
}

var normalizeTemplateName = function (path){
   path.replace(/.*(^|\/)templates\//, "").replace(/.js.ed/, "")
}

module.exports = compressFiles


