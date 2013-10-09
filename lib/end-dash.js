var ConfiguredParser = require("./configured_parser")
function EndDash () {
  this.ConfiguredParser = ConfiguredParser
  this.loadTemplates()
  //look here for templates
}

EndDash.prototype.template = function(templateName, model) {
    var Template = this.ConfiguredParser.getTemplate(templateName)
    return new Template(model)
}

EndDash.prototype.rawTemplate = function(templateName) {
  return this.ConfiguredParser.returnRawTemplate(templateName)
}

EndDash.prototype.loadTemplates = function() {
  var endDashTemplates = $("script[type='EndDash']")
  var that = this
  _(endDashTemplates).each(function(template){
    that.ConfiguredParser.registerTemplate(template.getAttribute('name'), that.normalizeTemplate(template))
  })
}

EndDash.prototype.normalizeTemplate = function(template) {
  template = $(template).text()
  return template.replace(/^\s*/, "").replace(/\s*$/, "")
}

module.exports = new EndDash()
