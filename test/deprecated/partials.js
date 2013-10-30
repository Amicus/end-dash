require('../support/helper');

var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , _ = require("underscore")
  , jqts = require("../../lib/util").jqts
  , EndDash = require("../../lib/end-dash")
  , TemplateStore = require('../../lib/template_store')
  , generateTemplate = require("../support/generate_template")

describe("A template with partials", function() {
  it("should do collections", function() {
    var templates = [
      "/templates/partials.html",
      "/templates/embedded_partial.html",
      "/templates/list_item.html"
    ]

    var model = {
      items: new Backbone.Collection([{ variable: "wat1" }, { variable: "wat2" }]),
      thing: new Backbone.Model({ name: "Zach" })
    }

    _(templates).each(function(template) {
      TemplateStore.load(template, fs.readFileSync(__dirname + template).toString())
    })

    var template = generateTemplate(model, '/templates/partials.html')

    expect($(".items- .item-:nth-child(1) .variable-").html()).to.be("wat1")
    expect($(".items- .item-:nth-child(2) .variable-").html()).to.be("wat2")
    expect($(".thing- .name-").html()).to.be("Zach")
    expect($("embed").length).to.be(0)
  })
})
