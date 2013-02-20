var generateTemplate = require("./util").generateTemplate
  , Backbone = require("backbone")
  , expect = require("expect.js")
  , _ = require("underscore")
  , fs = require("fs")

describe("When I replace an embedded model", function() {
  it("should change it in the template", function() {
    var subModel = new Backbone.Model({ title: "a title" })
    var model = new Backbone.Model({ 
      subModel: subModel
    })
      , markup = '<div><div class = "subModel-"><div class = "title-"></div></div></div>'
      , template = generateTemplate(model, markup)
  
    $("body").html(template.template)
    expect($(".title-").html()).to.be("a title")
  
    model.set("subModel", new Backbone.Model({ title: "a new title" }))

    _(subModel._events).each(function(events, key) {
      expect(events.length).to.be(0)
    })
  
    expect($(".title-").html()).to.be("a new title")
  })
})
 
