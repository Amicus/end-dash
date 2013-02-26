function generateTemplate(model, markup) {
  var EndDash = require("../lib/end-dash")
    , Template, template
  if(markup.charAt(0) === '/') {
    Template = new EndDash.getTemplate(markup)
  } else {
    Template = new EndDash(markup).generate() 
  }
  template = new Template(model, { templateName: "/test/support/template.html" }) 

  $("body").html(template.template)
  return template
}
module.exports = { generateTemplate: generateTemplate }
