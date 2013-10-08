var EndDash = require("./end-dash")
  , fs = require("fs")

var compile = module.exports = function(module, filename, content) {
  var Parsed = new EndDash(content, { templateName: filename.replace(/\.js\.ed(\.erb)?$/, "") })
  module.exports = Parsed.generate()
}
if(require.extensions) {
   require.extensions[".ed"] = require.extensions[".js.ed"] = compile
}
