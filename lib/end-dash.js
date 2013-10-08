var ConfiguredParser = require("./configured_parser")
function EndDash () {
  this.ConfiguredParser = ConfiguredParser
  this.UnparsedTemplates = {}
  this.loadTemplates()
  //look here for templates
}

EndDash.prototype.template = function(templateName, model) {
  if (!ConfiguredParser.hasTemplate(templateName)) {
    if(!this.UnparsedTemplates[templateName]){
      throw new Error("Template " + templateName + "is not loaded in EndDash")
    }
    var ParsedTemplate = new ConfiguredParser(this.UnparsedTemplates[templateName], {templateName: templateName})
    // Above line is confusing because making a new configured parser will actually parse the template
    var Template = Parsed.generate()
    return new Template(model)
  }
}

EndDash.prototype.loadTemplates = function() {
  var endDashTemplates = $("script[type='endDash']")
  _(endDashTemplates).each(function(template){
    this.UnparsedTemplates[template.name] = template.innerHTML
  })
}

module.exports = new EndDash()
