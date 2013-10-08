_ = require('underscore')
  , expect = require("expect.js")
  , jsdom = require("jsdom")

require("./helper")

describe("loading EndDash on the page", function() {
  it("should store all the scripts of type EndDash as templates", function() {
    var html = "<script type='EndDash' name='testing'> <div class='test'></div> </script><div class = 'hi'><span></span><span></span><div class = 'woot'></div>"
      , $ = window.$
    window.document.body.innerHTML = html
    var EndDash = require('../lib/end-dash')
    expect(EndDash.UnparsedTemplates["testing"]).to.be(" <div class='test'></div> ")
  })
})

