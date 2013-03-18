var EndDash = require("./end-dash")
  , fs = require("fs")

module.exports = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8')
  var Parsed = new EndDash(content, { templateName: filename.replace(/\.js\.ed(\.erb)?$/, "") })
  module.exports = Parsed.generate()
}
