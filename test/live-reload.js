var path = require("path")
  , expect = require("expect.js")
  , generateTemplate = require("./util").generateTemplate

require("../lib/template")

describe("Setting a single variable", function() {

  it("should be set in the html", function () {
    var template = generateTemplate({ singleVariable: "this is value" }, '<div class = "singleVariable-"></div>')
    expect($(".singleVariable-").html()).to.be("this is value")

    var newTemplate = '<p class = "singleVariable-"></p>'

    Template = (new EndDash(markup)).serialize()
    template.init()
  })
})
