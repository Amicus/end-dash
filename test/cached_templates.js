_ = require('underscore')
  , expect = require("expect.js")
  , jsdom = require("jsdom")

require("./helper")

describe("loading EndDash on the page", function() {
  it("should store the scripts of type EndDash as a template", function() {
    var html = '<script type="EndDash" name="testing"> <div class="test"></div> </script> <div class = "hi"><span></span><span></span><div class = "woot"></div>  <script type="EndDash" name="helloWorld"> <div id="baller"> <span></span> </div> <div id="test" class="name-"></div> </script>'
      , $ = window.$
    window.document.body.innerHTML = html
    var EndDash = require('../lib/end-dash')
    expect(EndDash.rawTemplate("testing")).to.be(" <div class='test'></div> ")
    expect(EndDash.rawTemplate("helloWorld")).to.be(" <div id='baller'> <span></span> </div> <div id='test' class='name-'></div> ")
  })
})

describe("binding a new model on the page", function() {
  it("should store the scripts of type EndDash as a template", function() {
    var EndDash = require('../lib/end-dash')
    var template = EndDash.template("helloWorld", {name: "Devon"})
    window.document.body.innerHTML = template.template
    expect($($('#test')).text()).to.be("Devon")
  })
})

