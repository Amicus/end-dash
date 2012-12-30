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
      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect(opts.el.is($(".thing-"))).to.be(true)
        expect(opts.template).to.be(template)
        done()
      })
    }

    TemplateGenerator.registerView("TestView", MockView)

    Template = new TemplateGenerator('<div class = "thing- testView-"></div>').generate()
    template = new Template(model)
    $("body").append(template.template)
  })

   it("should setup the view heirarchy correctly", function(done) {
    var model = new Model({ ohHi: "Hello There" })
      , TemplateGenerator = window.require("/lib/end-dash")
      , $ = window.$
      , Template
      , template

    function Parent() {}

    function MockView(opts) {
      expect(this).to.be.a(MockView)
      expect(opts.model).to.be(model)
      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect(opts.el.is($(".thing-"))).to.be(true)
        expect(opts.template).to.be(template)
        done()
      })
    }

    TemplateGenerator.registerView("EmbeddedTestView", MockView)
    TemplateGenerator.registerView("TestView", Parent)

    Template = new TemplateGenerator('<div class = "testView-"><div class = "thing- embeddedTestView-"></div></div>').generate()
    template = new Template(model)
    $("body").append(template.template)
  })
  it("should setup a view for collections", function(done) {
    var model = { herp: { things: new Collection([]) } }
      , TemplateGenerator = window.require("/lib/end-dash")
      , $ = window.$
      , Template
      , template

    function Parent() {}

    function MockView(opts) {
      expect(this).to.be.a(MockView)
      expect(opts.collection).to.be(model.herp.things)
      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect(opts.el.is($(".things-"))).to.be(true)
        expect(opts.template).to.be(template.get("herp").get("things"))
        done()
      })
    }

    TemplateGenerator.registerView("TestCollectionView", MockView)
    TemplateGenerator.registerView("TestView", Parent)

    Template = new TemplateGenerator('<div class = "herp-"><div class = "testView-"><ul class = "things- testCollectionView-"><li class = "thing-"></li></ul></div></div>').generate()
    template = new Template(model)
    $("body").append(template.template)
  })
  it("should bind a view to submodels", function(done) {
    var model = { thing: { value: "derp" } }
      , TemplateGenerator = window.require("/lib/end-dash")
      , $ = window.$
      , Template
      , template

    function Parent() { }

    function MockView(opts) {
      expect(this).to.be.a(MockView)
      expect(opts.model).to.be(model.thing)
      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect(opts.el.is($(".thing-"))).to.be(true)
        expect(opts.template).to.be(template.get("thing"))
        done()
      })
    }

    TemplateGenerator.registerView("TestCollectionView", MockView)
    TemplateGenerator.registerView("TestView", Parent)

    Template = new TemplateGenerator('<div class = "testView-"><div class = "thing- testCollectionView-"><div class = "value-"></div></div></div>').generate()
    template = new Template(model)
    $("body").append(template.template)
  }) 
})
