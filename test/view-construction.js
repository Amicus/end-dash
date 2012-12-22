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
 
describe("When I initialize a template with a view bound to it", function() {
  it("it should initialize the view correctly", function(done) {
    var model = new Model({ ohHi: "Hello There" })
      , TemplateGenerator = window.require("/lib/end-dash")
      , $ = window.$
      , Template
      , template


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

    TemplateGenerator.registerView("TestView", MockView)

    Template = new TemplateGenerator('<div class = "thing- testView-"></div>').generate()
    template = new Template(model)
  })

   it("should setup the view heirarchy correctly", function(done) {
    var model = new Model({ ohHi: "Hello There" })
      , TemplateGenerator = window.require("/lib/end-dash")
      , $ = window.$
      , Template
      , template

    var parentInstance
    function Parent() {
      parentInstance = this
    }

    function MockView(opts) {
      expect(this).to.be.a(MockView)
      expect(opts.model).to.be(model)
      expect(opts.parent).to.be.a(Parent)
      expect(opts.parent).to.be(parentInstance)
      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect(opts.template).to.be(template)
        done()
      })
    }

    TemplateGenerator.registerView("EmbeddedTestView", MockView)
    TemplateGenerator.registerView("TestView", Parent)

    Template = new TemplateGenerator('<div class = "testView-"><div class = "thing- embeddedTestView-"></div></div>').generate()
    template = new Template(model)
  })
  it("should setup a view for collections", function(done) {
    var model = { things: new Collection([]) }
      , TemplateGenerator = window.require("/lib/end-dash")
      , $ = window.$
      , Template
      , template

    var parentInstance
    function Parent() {
      parentInstance = this
    }

    function MockView(opts) {
      expect(this).to.be.a(MockView)
      expect(opts.collection).to.be(model.things)
      expect(opts.parent).to.be.a(Parent)
      expect(opts.parent).to.be(parentInstance)
      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect(opts.template).to.be(template.collections["things"])
        done()
      })
    }

    TemplateGenerator.registerView("TestCollectionView", MockView)
    TemplateGenerator.registerView("TestView", Parent)

    Template = new TemplateGenerator('<div class = "testView-"><ul class = "things- testCollectionView-"><li class = "thing-"></li></ul></div>').generate()
    template = new Template(model)
  })
})
