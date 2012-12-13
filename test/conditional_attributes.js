var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })

describe("A conditional attribute", function() {

  it("should be set correctly", function () {
    var TemplateGenerator = window.require("/lib/end-dash")
      , Template = new TemplateGenerator('<div id="el" class="#{set ? omgYes}"></div>').generate()
      , template = new Template

    $("body").append(template.template)

    expect($("#el").attr("class")).to.be("omgYes")

    template.set("set", false)
    expect($("#el").attr("class")).to.be("")

    template.set("set", true)
    expect($("#el").attr("class")).to.be("omgYes")
  })
}) 
