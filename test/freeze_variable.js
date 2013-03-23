var path = require("path")
  , expect = require("expect.js")
  , Template = require("../lib/template")
  , Model = require("backbone").Model
  , generateTemplate = require("./util").generateTemplate

require("../lib/template")

describe("freezing a template with a simple variable", function() {

  it("should be writeable when thawed", function () {
    var template = generateTemplate(new Model({ singleVariable: "this is value" }), '<div class = "singleVariable-"></div>')

    var frozen = template.freeze()
    frozen = JSON.parse(JSON.stringify(frozen))
    var thawed = Template.thaw(frozen)
    var model = thawed.model 
    var newTemplate = thawed.template

    $("body").html(newTemplate.template)

    expect($(".singleVariable-").html()).to.be("this is value")
    model.set("singleVariable", "new value")
    expect($(".singleVariable-").html()).to.be("new value")
  })

}) 
