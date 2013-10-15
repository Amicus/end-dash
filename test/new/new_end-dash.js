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
  it("binding templates should work", function(){
    var items = new Backbone.Collection()
    var item1 = new Backbone.Model({variable: "Candy"})
    var item2 = new Backbone.Model({variable: "Cane"})
    var item3 = new Backbone.Model({variable: "Good"})
    items.add(item1).add(item2).add(item3)
    var root = new Backbone.Model({items: items, thing: {name: "very"}})
    EndDash.bindTemplate("partials", root)
  })
})

