var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })
 
describe("when the template has a form element", function() {
it("should update the model when it changes to it's change")
//  var model = new Backbone.Model({ name: "old" })
//    , markup = '<div class = "model-"><input type="text" class = "name-"></div>'
//    , TemplateGenerator = window.require("/lib/end-dash")
//    , Template = new TemplateGenerator(markup).generate()
//    , template = new Template({ model: model })
//
//  $("body").html(template.template)
//
//  $(".name-").val("new").change()
//
//  expect(model.get("name")).to.be("new")
//})
}) 
