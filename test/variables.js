var path = require("path")
  , expect = require("expect.js")

scriptModule(path.join(__dirname, "..", "lib", "end-dash.js"))

describe("Setting a single variable", function() {
  var template

  beforeEach(function () {
    var EndDash = window.require("/lib/end-dash") 
    template = new EndDash('<div class = "singleVariable-"></div>')
  })

  it("should be set in the html", function () {
    template.set("singleVariable", "this is value")
    $("body").append(template.template)
    expect($(".singleVariable-").html()).to.be("this is value")
  })
})
