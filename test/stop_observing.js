var path = require("path")
  , Model = require("backbone").Model
  , expect = require("expect.js")
  , fs = require("fs")
  , generateTemplate = require("./util").generateTemplate

require("./helper")

describe("When I clean up a template", function() { 
  it("should remove listeners from the presenter", function() {
    var model = { person: new Model({ name: "zach" }) }
      , markup = '<div class="person-"><div class="name-"></div></div>'
      , template = generateTemplate(model, markup)

    expect($(".name-").html()).to.be("zach")

    template.cleanup()
    template.cleanup()
    template.cleanup()
    template.cleanup()
    template.cleanup()
    template.cleanup()
    template.cleanup()
    template.cleanup()
    template.cleanup()
    model.person.set("name", "devin")

    expect($(".name-").html()).to.not.be("devin")
    expect($(".name-").html()).to.be("zach")
  })
})
