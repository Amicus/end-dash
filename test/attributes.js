var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })

//describe("An element with an attribute", function() {
//  it("should set the attribute", function () {
//    var TemplateGenerator = window.require("/lib/end-dash")
//      , Template = new TemplateGenerator(fs.readFileSync(__dirname + "/support/attributes.html").toString()).generate()
//      , template = new Template
//
//    template.set("name", "zach")
//
//    $("body").append(template.template)
//    expect($("#link").attr("href")).to.be("/person/zach")
//  })
//})
//describe("An element with multiple attributes", function() {
//  it("should set the attribute")
//  var TemplateGenerator = window.require("/lib/end-dash")
//    , Template = new TemplateGenerator('<a id = "link" href = "#{one} and #{two}"></a>').generate()
//    , template = new Template
//
//  template.set("one", "1")
//  template.set("two", "2")
//
//  $("body").append(template.template)
//  expect($("#link").attr("href")).to.be("1 and 2")
//})
//})
