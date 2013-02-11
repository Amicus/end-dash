var path = require("path")
  , Model = require("backbone").Model
  , expect = require("expect.js")
  , fs = require("fs")

describe("An element with an attribute", function() {
  beforeEach(function() {
    this.markup = '<div><a href="/person/#{name}" id = "link"></a></div>'
    this.TemplateGenerator = window.require("/lib/end-dash")
    this.Template = new this.TemplateGenerator(this.markup).generate()
  })
  it("should set the attribute", function () {
    var template = new this.Template({ name: "zach" })

    $("body").append(template.template)
    expect($("#link").attr("href")).to.be("/person/zach")
  })
  it("should update the element's attribute when the model's attribute changes", function() {
    var model = new Model({ name: "zach" })
      , template = new this.Template(model)

    $("body").append(template.template)
    expect($("#link").attr("href")).to.be("/person/zach")

    model.set("name", "newName")
    expect($("#link").attr("href")).to.be("/person/newName")
  })
})

describe("An element with an attribute with multiple interpolations", function() {
  beforeEach(function() {
    this.TemplateGenerator = window.require("/lib/end-dash")
  })
  it("should set the attribute", function() {
    var Template = new this.TemplateGenerator('<a id="link" href="#{one} and #{two}"></a>').generate()
      , template = new Template({ one: "1", two: "2" })

    $("body").append(template.template)
    expect($("#link").attr("href")).to.be("1 and 2")
  })
})

describe("An element with multiple attributes and interpolations", function() {
  beforeEach(function() {
    this.TemplateGenerator = window.require("/lib/end-dash")
  })

  it("should set the attribute", function() {
    var Template = new this.TemplateGenerator('<a id="link" href="#{one} and #{two}" class="#{three}"></a>').generate()
      , template = new Template({ one: "1", two: "2", three: "3" })

    $("body").append(template.template)
    expect($("#link").attr("href")).to.be("1 and 2")
    expect($("#link").attr("class")).to.be("3")
  })
})
