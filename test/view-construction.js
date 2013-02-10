var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , ViewReaction = require("../lib/reactions/views")
  , Model = Backbone.Model
  , Collection = Backbone.Collection

 
script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "reactions", "variable.js"), { module: true })
script(path.join(__dirname, "..", "lib", "reactions", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "reactions", "model.js"), { module: true })
script(path.join(__dirname, "..", "lib", "reaction.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })

describe("When I initialize a template with a view bound to it", function() {
  it("it should initialize the view correctly", function(done) {
    var model = new Model({ ohHi: "Hello There" })
      , TemplateGenerator = window.require("/lib/end-dash")
      , $ = window.$
      , Template
      , template

    TemplateGenerator.registerReaction(ViewReaction)


    function MockView(opts) {
      var that = this
      expect(this).to.be.a(MockView)
      expect(opts.model).to.be(model)
      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect($(".ohHi-").data("view")).to.be(that)
        expect(opts.el.is($(".ohHi-"))).to.be(true)
        expect(opts.template).to.be(template)
        done()
      })
    }

    ViewReaction.registerView("TestView", MockView)

    Template = new TemplateGenerator('<div class = "ohHi- testView-"></div>').generate()
    template = new Template(model)
    $("body").append(template.template)
  })

   it("should setup the view heirarchy correctly", function(done) {
    var model = new Model({ ohHi: "Hello There" })
      , TemplateGenerator = window.require("/lib/end-dash")
      , $ = window.$
      , Template
      , template

    TemplateGenerator.registerReaction(ViewReaction)

    function Parent() {}

    function MockView(opts) {
      var that = this
      expect(this).to.be.a(MockView)
      expect(opts.model).to.be(model)

      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect($(".ohHi-").data("view")).to.be(that)
        expect(opts.el.is($(".ohHi-"))).to.be(true)
        expect(opts.template).to.be(template)
        done()
      })
    }

    ViewReaction.registerView("EmbeddedTestView", MockView)
    ViewReaction.registerView("TestView", Parent)

    Template = new TemplateGenerator('<div class = "testView-"><div class = "ohHi- embeddedTestView-"></div></div>').generate()
    template = new Template(model)
    $("body").append(template.template)
  })
  it("should setup a view for collections", function(done) {
    var model = { herp: { things: new Collection([]) } }
      , TemplateGenerator = window.require("/lib/end-dash")
      , $ = window.$
      , Template
      , template

    TemplateGenerator.registerReaction(ViewReaction)

    function Parent() {
      this.name = "parent"
    }

    function MockView(opts) {
      this.name = "mock"
      var that = this
      expect(this).to.be.a(MockView)
      expect(opts.collection).to.be(model.herp.things)
      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect($(".things-").data("view")).to.be(that)
        expect(opts.el.is($(".things-"))).to.be(true)
        done()
      })
    }

    ViewReaction.registerView("TestCollectionView", MockView)
    ViewReaction.registerView("TestView", Parent)

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

    TemplateGenerator.registerReaction(ViewReaction)

    function Parent() {}

    function MockView(opts) {
      var that = this
      expect(this).to.be.a(MockView)
      expect(opts.model).to.be(model.thing)
      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect($(".thing-").data("view")).to.be(that)
        expect(opts.el.is($(".thing-"))).to.be(true)
        done()
      })
    }

    ViewReaction.registerView("TestCollectionView", MockView)
    ViewReaction.registerView("TestView", Parent)

    Template = new TemplateGenerator('<div class = "testView-"><div class = "thing- testCollectionView-"><div class = "value-"></div></div></div>').generate()
    template = new Template(model)
    $("body").append(template.template)
  }) 
})
