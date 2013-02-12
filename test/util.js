function generateTemplate(model, markup) {
  var EndDash = require("../lib/end-dash")
    , Template = new EndDash(markup).generate()
    , template = new Template(model)

  $("body").html(template.template)

  return template
}
module.exports = { generateTemplate: generateTemplate }
