var ConfiguredParser = require("./configured_parser")

var EndDash = module.exports = function() {
  this.Parser = ConfiguredParser
  this.loadHTMLTemplates()
}

EndDash.prototype.createTemplate = function(templateName, model) {
    var Template = this.Parser.getTemplate(templateName)
    return new Template(model)
}

EndDash.prototype.getHTMLTemplate = function(templateName) {
  return this.Parser.getHTMLTemplate(templateName)
}

EndDash.prototype.loadHTMLTemplates = function() {
  var that = this
  _(this.EndDashTemplatesOnPage()).each(function(template){
    that.Parser.registerTemplate(template.getAttribute('name'), that.normalizeTemplate(template))
  })
}

EndDash.prototype.normalizeTemplate = function(template) {
  return template.textContent.replace(/^\s*/, "").replace(/\s*$/, "")
}

EndDash.prototype.EndDashTemplatesOnPage = function() {
  var _document = window.document
  var scriptTags = _document.getElementsByTagName("SCRIPT")
  return _.filter(scriptTags, function(scriptElem) {
    return scriptElem.type == "EndDash"
  })
}

