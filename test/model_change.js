var generateTemplate = require("./util").generateTemplate
  , ViewReaction = require("../lib/reactions/view")
  , Backbone = require("backbone")
  , expect = require("expect.js")
  , _ = require("underscore")
  , fs = require("fs")
  , views = {}

ViewReaction.setGetView(function(name) {
  return views[name]
})

describe("When I replace an embedded model", function() {
  it("should change it in the template", function() {
    var subModel = new Backbone.Model({ title: "a title" })
      , model = new Backbone.Model({ subModel: subModel })
      , markup = '<div><div class = "subModel-"><div class = "title-"></div></div></div>'
      , template = generateTemplate(model, markup)
  
    expect($(".title-").html()).to.be("a title")
  
    model.set("subModel", new Backbone.Model({ title: "a new title" }))
  
    expect($(".title-").html()).to.be("a new title")
  })

  it("should stop listening to old views", function(done) {
    var testView = views.testView = function() { this.stopListening = function() { done(); } }
      , subModel = new Backbone.Model({ title: "a title" })
      , model = new Backbone.Model({ subModel: subModel })
      , markup = '<div><div class = "subModel-" data-view="testView"><div class = "title-"></div></div></div>'
      , template = generateTemplate(model, markup)

  
    expect($(".title-").html()).to.be("a title")
  
    model.set("subModel", new Backbone.Model({ title: "a new title" }))
  
    expect($(".title-").html()).to.be("a new title")
  })
})
