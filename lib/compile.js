var EndDash = require("./end-dash")
  , fs = require("fs")

var compile = module.exports = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8')
  var Parsed = new EndDash(content, { templateName: filename.replace(/\.js\.ed(\.erb)?$/, "") })
  module.exports = Parsed.generate()
}

module.exports.cjsify = function(contents) {
  var esprima = require("esprima")
    , code = 'var EndDash = require("end-dash");'
           + 'module.exports = new EndDash('
           + JSON.stringify(contents)
           + ', { templateName: __filename.replace(/.ed$/, "") })'

  return esprima.parse(code)
}

if(require.extensions) {
   require.extensions[".ed"] = require.extensions[".js.ed"] = compile
}
