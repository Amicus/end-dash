var expect = require("expect.js")
  , jsdom = require("jsdom")
  , Backbone = require("backbone")
  , EndDash = require('../../lib/end-dash')
  , fs = require('fs')
  , util = require("../util")

_ = require('underscore')

var partials = fs.readFileSync(__dirname + "/../support/partials.html", 'utf8')
var embedded_partial = fs.readFileSync(__dirname + "/../support/embedded_partial.html", 'utf8')
var list_item = fs.readFileSync(__dirname + "/../support/list_item.html", 'utf8')
var scopes = fs.readFileSync(__dirname + "/../support/scopes.html", 'utf8')

describe("With a set of templates loaded into EndDash", function(){
  beforeEach(function(){
    EndDash.registerTemplate("partials", partials)
    EndDash.registerTemplate("embedded_partial.html", embedded_partial)
    EndDash.registerTemplate("list_item.html", list_item)
    EndDash.registerTemplate("scopes", scopes)
  })

  it("should have all the teamples interanlly", function(){
    expect(EndDash.isTemplateLoaded("partials")).to.be(true)
    expect(EndDash.isTemplateLoaded("embedded_partial.html")).to.be(true)
    expect(EndDash.isTemplateLoaded("list_item.html")).to.be(true)
    expect(EndDash.isTemplateLoaded("scopes")).to.be(true)
  })

  describe("Binding a template on the page", function(){
    beforeEach(function(){
      this.items = new Backbone.Collection()
      this.item1 = new Backbone.Model({variable: "Candy"})
      this.item2 = new Backbone.Model({variable: "Cane"})
      this.item3 = new Backbone.Model({variable: "Good"})
      this.items.add(this.item1).add(this.item2).add(this.item3)
      this.root = new Backbone.Model({items: this.items, thing: {name: "very"}})
      this.template = EndDash.bindTemplate("partials", this.root)
    })
    it("EndDash should fill in the model values in the template", function(){
      expect($('.item-:nth-child(1) div', this.template.el).text()).to.be("Candy")
      expect($('.item-:nth-child(2) div', this.template.el).text()).to.be("Cane")
      expect($('.item-:nth-child(3) div', this.template.el).text()).to.be("Good")
      expect($('.name-', this.template.el).text()).to.be("very")
    })
    it("Should update when a model changes", function(){
      this.item1.set("variable", "Steak")
      expect($('.item-:nth-child(1) div', this.template.el).text()).to.be("Steak")
      this.item2.set("variable", "Also")
      expect($('.item-:nth-child(2) div', this.template.el).text()).to.be("Also")
    })
  })
})

