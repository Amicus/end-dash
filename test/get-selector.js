var Template = require("../lib/end-dash")
  , path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })

describe("getSelector", function() {
  it("should return a selector unique within root", function() {
    var html = '<div class = "hi"><span></span><span><div class = "woot"</span></div>'
      , $ = window.$
    window.document.body.innerHTML = html
    var root = $(".hi")
    var element = $(".woot")
    console.log(Template.getSelector(element, root))
  })
})
