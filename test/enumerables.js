var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })

describe("An enumerable template", function() {

  it("should set all the values in the html", function () {
    var TemplateGenerator = window.require("/lib/end-dash")
      , Template = new TemplateGenerator(fs.readFileSync(__dirname + "/support/enumerable.html").toString()).generate()
      , template = new Template

    template.set("people", [{name: "Zach"}, {name: "Dog"}])

    $("body").append(template.template)

    expect($(".people- .person-:nth-child(1) .name-").html()).to.be("Zach")
    expect($(".people- .person-:nth-child(2) .name-").html()).to.be("Dog")
  })

}) 
