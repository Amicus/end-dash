var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Model = require("backbone").Model
  , ed = require("../lib/end-dash")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })
 
describe("When I initialize a template with a model", function() {
  it("should bind to the values", function () {
    var model = new Model({ ohHi: "Hello There" })
      , TemplateGenerator = window.require("/lib/end-dash")
      , Template = new TemplateGenerator('<div class = "ohHi-"></div>').generate()
      , template = new Template(model)
      , $ = window.$

    $(window.document.body).append(template.template)
    expect($(".ohHi-").html()).to.be("Hello There")
  })
})
