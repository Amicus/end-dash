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
  it("should bind to the values", function(done) {
    var model = new Model({ ohHi: "Hello There" })
      , TemplateGenerator = window.require("/lib/end-dash")
      , $ = window.$
      , Template
      , template

    TemplateGenerator.configure({ viewDirectory: "/test/views" })

    function MockView(opts) {
      expect(this).to.be.a(MockView)
      expect(opts.model).to.be(model)
      expect(opts.parent).to.be(null)
      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect(opts.template).to.be(template)
        done()
      })
    }
    window.require.modules["/test/views/test_view.js"] = { exports: MockView }

    Template = new TemplateGenerator('<div class = "thing- testView-"></div>').generate()
    template = new Template(model)
  })
})
