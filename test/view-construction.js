require('./support/helper');

var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , ViewStore = require("../lib/view_store")
  , Model = Backbone.Model
  , Collection = Backbone.Collection
  , generateTemplate = require("./support/generate_template")
  , views = {}

describe("When I initialize a template with a view bound to it", function() {
  beforeEach(function() {
    ViewStore.setCustomGetView(function(name) {
      return views[name];
    })
  });

  afterEach(function() { ViewStore.setCustomGetView(null); });

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
        done()
      })
    }
    views.testView = MockView

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
        done()
      })
    }

    views.embeddedTestView = MockView
    views.testView = Parent

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

    views.testCollectionView = MockView
    views.testView = Parent

    var model = { herp: { things: new Collection([]) } }
      , template = generateTemplate(model, '<div class = "herp-"><div class = "testView-"><ul class = "things- testCollectionView-"><li data-each><div></div></li></ul></div></div>')
  })
  it("should bind a view to submodels", function(done) {
    function Parent() {}

    function MockView(opts) {
      var that = this
      expect(this).to.be.a(MockView)
      expect(opts.model.attributes).to.eql(model.thing)
      //next tick because we have to allow the template constructor to return
      //in order to check that it passed itself in
      process.nextTick(function() {
        expect(opts.el.is(".thing-")).to.be(true)
        done()
      })
    }
    views.testCollectionView = MockView
    views.testView = Parent

    var model = { thing: { value: "derp" } }
      , template = generateTemplate(model, '<div class = "testView-"><div class = "thing- testCollectionView-"><div class = "value-"></div></div></div>')
  })

  it("should setup the view with the correct scope, once", function(done) {
    var model = { currentUser: new Model() }
      , template

    views["navigation/menu_view"] = function(opts) {
      expect(opts.model).to.be(model.currentUser)
      done()
    }

    template = generateTemplate(model, '<div data-scope="/currentUser" data-view="navigation/menu_view"></div>')
  })
})
