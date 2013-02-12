var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")

describe("A conditional attribute", function() {
  beforeEach(function() {
    this.TemplateGenerator = window.require("/lib/end-dash")
    this.model = new Backbone.Model({})
  })

  it("should be set correctly", function () {
    var Template = new this.TemplateGenerator('<div id="el" class="#{set ? omgYes}"></div>').generate()
      , template = new Template(this.model)

    $("body").append(template.template)

    expect($("#el").attr("class")).to.be("")

    this.model.set("set", true)
    expect($("#el").attr("class")).to.be("omgYes")

    this.model.set("set", false)
    expect($("#el").attr("class")).to.be("")
  })

  it("should handle else replacement values", function() {
    var Template = new this.TemplateGenerator('<div id="el" class="#{set ? omgYes : omgNo }"></div>').generate()
      , template = new Template(this.model)
    
    $("body").append(template.template)
        
    this.model.set("set", false)
    expect($("#el").attr("class")).to.be("omgNo")
    
    this.model.set("set", true)
    expect($("#el").attr("class")).to.be("omgYes")
  })

}) 
