var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , ViewReaction = require("../lib/reactions/views")
  , Model = Backbone.Model
  , Collection = Backbone.Collection
  , generateTemplate = require("./util").generateTemplate

describe("When I initialize a template with a view bound to it", function() {
  it("it should initialize the view correctly", function(done) {

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
    ViewReaction.registerView("testView", MockView)

    var model = new Model({ ohHi: "Hello There" })
      , template = generateTemplate(model, '<div class = "ohHi- testView-"></div>')
  })

   it("should setup the view heirarchy correctly", function(done) {
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
    ViewReaction.registerView("embeddedTestView", MockView)
    ViewReaction.registerView("testView", Parent)

    var model = new Model({ ohHi: "Hello There" })
      , template = generateTemplate(model, '<div class = "testView-"><div class = "ohHi- embeddedTestView-"></div></div>')
  })
  it("should setup a view for collections", function(done) {

    function Parent() {}
    function MockView(opts) {
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
    ViewReaction.registerView("testCollectionView", MockView)
    ViewReaction.registerView("testView", Parent)

    var model = { herp: { things: new Collection([]) } }
      , template = generateTemplate(model, '<div class = "herp-"><div class = "testView-"><ul class = "things- testCollectionView-"><li class = "thing-"></li></ul></div></div>')
  })
  it("should bind a view to submodels", function(done) {
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
    ViewReaction.registerView("testCollectionView", MockView)
    ViewReaction.registerView("testView", Parent)

    var model = { thing: { value: "derp" } }
      , template = generateTemplate(model, '<div class = "testView-"><div class = "thing- testCollectionView-"><div class = "value-"></div></div></div>')

    $("body").append(template.template)
  }) 
})
