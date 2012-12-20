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
    expect($(".things- .thing-:nth-child(2)").html()).to.be("cool")

    expect($(".things- .thing-:nth-child(1)").hasClass("whenAwesome-")).to.be(true)
    expect($(".things- .thing-:nth-child(2)").hasClass("whenCool-")).to.be(true)
  })
  it("should only initiate the view class for it's type")
  it("should show the default template when the key doesn't exist")
  it("should throw an error if the key doesn't exist and there is no default template")
  it("should throw an error multiple polymorphic keys are defined on an element")
  it("should throw an error multiple polymorphic values are defined on an element")
  it("should throw an error if a polymorphic key is defined in the wrong place")
  it("should throw an error if a polymorphic value is defined in the wrong place")
  it("should throw an error if a polymorphic value and key are defined on the same element")
  it("should throw an error if we don't set a polymorpicValue for a polymorpic collection")
  it("should throw an error if there are multiple elements inside a non polymorpic collection")
  it("should initialize a new view class when I change the type")
  describe("when I bind to the collection", function() {
    it("should change the item when the type changes")
  })
})
