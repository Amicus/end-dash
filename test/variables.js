var path = require("path")
  , expect = require("expect.js")

scriptModule(path.join(__dirname, "..", "lib", "end-dash.js"))

describe("Setting a single variable", function() {
  var template
  beforeEach(function () {
    template = '<div class = "singleVariable-"></div>'

  })
  it("should be set in the html", function (done) {
    var EndDash = window.require("/lib/end-dash") 
      , template = new EndDash(template)

    template.set("singleVariable", "this is value")
    expect($(".singleVariable-").html()).to.be("this is value")
  })
})
