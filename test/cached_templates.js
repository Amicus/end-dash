_ = require('underscore')
  , expect = require("expect.js")
  , jsdom = require("jsdom")

require("./helper")

describe("loading EndDash on the page", function() {
  it("should store the scripts of type EndDash as a template", function() {
    var html = "<script type='EndDash' name='testing'> <div class='test'></div> </script> <div class = 'hi'><span></span><span></span><div class = 'woot'></div>  <script type='EndDash' name='helloWorld'> <div id='baller'> <span></span> </div> <div> Text is here </div> </script>  "
      , $ = window.$
    window.document.body.innerHTML = html
    var EndDash = require('../lib/end-dash')
    expect(EndDash.UnparsedTemplates["testing"]).to.be(" <div class='test'></div> ")
  })

  it("should store all the scripts of type EndDash as templates", function() {
    var EndDash = require('../lib/end-dash')
    expect(EndDash.UnparsedTemplates["testing"]).to.be(" <div class='test'></div> ")
    expect(EndDash.UnparsedTemplates["helloWorld"]).to.be(" <div id='baller'> <span></span> </div> <div> Text is here </div> ")
  })
})

