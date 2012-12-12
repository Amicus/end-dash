var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , Model = Backbone.Model
  , Collection = Backbone.Collection
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
  it("should bind to a collection", function () {
    var models = new Collection([new Model({ name: "Hawg" }), new Model({ name: "Dawg" })])
      , TemplateGenerator = window.require("/lib/end-dash")
      , Template = new TemplateGenerator('<ul class="peeps-"><li class = "peep-"><div class="name-"></div></li></ul>').generate()
      , template = new Template({ peeps: models })
      , $ = window.$

    $(window.document.body).append(template.template)
    expect($(".peeps- li:nth-child(1) .name-").html()).to.be("Hawg")
    expect($(".peeps- li:nth-child(2) .name-").html()).to.be("Dawg")
  })
})
