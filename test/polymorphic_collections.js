var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })

describe("A polymporhic template", function() {

  it("should display the correct item based on type", function() {
    var TemplateGenerator = window.require("/lib/end-dash")
      , Template = new TemplateGenerator(fs.readFileSync(__dirname + "/support/polymorphic.html").toString()).generate()
      , template = new Template({ things: [{ type: "awesome" }, { type: "cool" }] })

    $("body").append(template.template)
    expect($(".things- .thing-:nth-child(1)").html()).to.be("awesome")
    expect($(".things- .thing-:nth-child(2)").html()).to.be("awesome")

    expect($(".things- .thing-:nth-child(1)").hasClass("whenAwesome-")).to.be(true)
    expect($(".things- .thing-:nth-child(2)").hasClass("whenCool-")).to.be(true)
  })
  it("should only initiate the view class for it's type")
  it("should only initiate the view class for it's type")
  it("should initialize a new view class when I change the type")
  describe("when I bind to the collection", function() {
    it("should change the item when the type changes")
  })
})
