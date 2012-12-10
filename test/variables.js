var path = require("path")
  , expect = require("expect.js")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })

describe("Setting a single variable", function() {
  it("should be set in the html", function () {
    var TemplateBuilder = window.require("/lib/end-dash") 
      , Template = new TemplateBuilder('<div class = "singleVariable-">derp</div>').generate()
      , template = new Template()

    template.set("singleVariable", "this is value")

    $("body").append(template.template)
    expect($(".singleVariable-").html()).to.be("this is value")
  })

  it("should be set in the html even when nested in other elements", function () {
    var TemplateBuilder = window.require("/lib/end-dash") 
      , Template = new TemplateBuilder('<div><div class = "singleVariable-"></div></div>').generate()

    var template = new Template()

    template.set("singleVariable", "this is value")

    $("body").append(template.template)
    expect($(".singleVariable-").html()).to.be("this is value")
  })

  it("should overwrite existing content", function () {
    var TemplateBuilder = window.require("/lib/end-dash") 
      , Template = new TemplateBuilder('<div><div class = "singleVariable-">derp</div></div>').generate()
      , template = new Template()

    template.set("singleVariable", "this is value")

    $("body").append(template.template)
    expect($(".singleVariable-").html()).to.not.be("derp")
  })
 
})
