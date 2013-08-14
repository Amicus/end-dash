var path = require("path")
  , expect = require("expect.js")
  , generateTemplate = require("./util").generateTemplate
  , Model = require("backbone").Model
  , EndDash = require("../index")

require("../lib/template")

describe("Setting a single variable", function() {

  it("should be set in the html", function () {
    var model = new Model({ singleVariable: "this is value", newVariable: "watever" })
    var template = generateTemplate(model, '<div class = "singleVariable-"></div>')
    expect($(".singleVariable-").html()).to.be("this is value")

    var newTemplate = '<div><p class = "singleVariable-"></p><span class="newVariable-"></span></div>'

    // this is so ugly! omg.
    var parts = (new EndDash(newTemplate)).serialize()
    template.init(parts.structure, parts.markup)

    expect($("p.singleVariable-").html()).to.be("this is value")
    model.set("singleVariable", "this new value")
    expect($("p.singleVariable-").html()).to.be("this new value")
  })
})
