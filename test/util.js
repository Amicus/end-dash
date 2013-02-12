function generateTemplate(model, markup) {
  var EndDash = require("../lib/end-dash")
    , Template = new EndDash(markup).generate()
    , template = new Template(model)

  $("body").append(template.template)

  return template
}
module.exports = { 
  generateTemplate: generateTemplate 
}
