var util = require("../lib/util")
  , path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")

script(path.join(__dirname, "..", "lib", "util.js"), { module: true })

describe("getSelector", function() {
  it("should return a selector unique within root", function() {
    var html = '<div class = "hi"><span></span><span><div class = "woot"</span></div>'
      , $ = window.$
    window.document.body.innerHTML = html
    var root = $(".hi")
      , element = $(".woot")

    expect($(util.getSelector(element, root), root).is(element)).to.be(true)
  })
  it("should use id as a base when it finds an id", function() {
    var html = '<div class = "hi"><span></span><span><div id = "hey"><span class = "woot"></span></div></div>'
      , $ = window.$
    window.document.body.innerHTML = html

    var root = $(".hi")
      , element = $(".woot")

    expect($(util.getSelector(element, root), root).is(element)).to.be(true)
    expect(util.getSelector(element, root)).to.be(".woot")
  })
  it("should create a unique selector for every element in complex markup", function() {
    var markup = fs.readFileSync(__dirname + "/support/complex_markup.html")
      , $ = window.$
    window.document.body.innerHTML = markup

    var root = $("#root")
      , elements = root.find("*")
    elements.each(function(i, el) {
      var selector = util.getSelector($(el), root)
        , found = root.find(selector)

      if(found.length == 0) {
        console.log(selector)

      }
      expect(found.length).to.be(1)
      expect(found.is(el)).to.be(true)
    })
  })
})
