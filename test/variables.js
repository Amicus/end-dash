var path = require("path")
  , expect = require("expect.js")

scriptModule(path.join(__dirname, "..", "lib", "end-dash.js"))

describe("Setting a single variable", function() {

  it("should be set in the html", function () {
    var EndDash = window.require("/lib/end-dash") 
      , template = new EndDash('<div class = "singleVariable-"></div>')
    template.set("singleVariable", "this is value")

    $("body").append(template.template)
    expect($(".singleVariable-").html()).to.be("this is value")
  })

  it("should be set in the html even when nested in other elements", function () {
    var EndDash = window.require("/lib/end-dash") 
      , template = new EndDash('<div><div class = "singleVariable-"></div></div>')

    template.set("singleVariable", "this is value")

    $("body").append(template.template)
    expect($(".singleVariable-").html()).to.be("this is value")
  })
})
