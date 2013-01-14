var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , _ = require("underscore")
  , jqts = require("../lib/util").jqts

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })

describe("A nested collection", function() {
  it("should support collections in collections in collections", function() {
    //use node's path in the browser env
    var EndDash = window.require("/lib/end-dash")

    var templates = [
      "/support/partials.html",
      "/support/embedded_partial.html",
      "/support/list_item.html"
    ]

    _(templates).each(function(template) {
      EndDash.registerTemplate(template, fs.readFileSync(__dirname + template).toString())
    })

    var Template = EndDash.getTemplate("/support/partials.html")
      , items = new Backbone.Collection([{ variable: "wat1" }, { variable: "wat2" }])
      , template = new Template({ items: items, thing: new Backbone.Model({ name: "Zach" }) })

    $("body").html(template.template)
    expect($(".items- .item-:nth-child(1) .variable-").html()).to.be("wat1")
    expect($(".items- .item-:nth-child(2) .variable-").html()).to.be("wat2")
    expect($(".thing- .name-").html()).to.be("Zach")
  })
})
