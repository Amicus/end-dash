var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })

describe("An element with an attribute", function() {
  it("should set the attribute", function () {
    window.console = console
    var Template = window.require("/lib/end-dash") 
      , template = new Template(fs.readFileSync(__dirname + "/support/attributes.html").toString())



    template.set("name", "zach")

    $("body").append(template.template)
    expect($("#link").attr("href")).to.be("/person/zach")
  })
})
