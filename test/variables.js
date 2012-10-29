var path = require("path")
  , expect = require("expect.js")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })

describe("Setting a single variable", function() {

  it("should be set in the html", function () {
    var Template = window.require("/lib/end-dash") 
      , template = new Template('<div class = "singleVariable-"></div>')
    template.set("singleVariable", "this is value")

    $("body").append(template.template)
    expect($(".singleVariable-").html()).to.be("this is value")
  })

  it("should be set in the html even when nested in other elements", function () {
    var Template = window.require("/lib/end-dash") 
      , template = new Template('<div><div class = "singleVariable-"></div></div>')

    template.set("singleVariable", "this is value")

    $("body").append(template.template)
    expect($(".singleVariable-").html()).to.be("this is value")
  })

  it("should overwrite existing content", function () {
    var Template = window.require("/lib/end-dash") 
      , template = new Template('<div class = "singleVariable-">derp</div>')

    template.set("singleVariable", "this is value")

    $("body").append(template.template)
    expect($(".singleVariable-").html()).to.not.be("derp")
  })
 
})
