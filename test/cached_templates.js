_ = require('underscore')
  , expect = require("expect.js")
  , jsdom = require("jsdom")

require("./helper")

describe("loading EndDash on the page", function() {
  it("should store the scripts of type EndDash as a template", function() {
    var html = '<script type="EndDash" name="testing">' +
                  ' <div class="test"></div>' +
                '</script>'
      , $ = window.$
    window.document.body.innerHTML = html
    var EndDash = require('../lib/end-dash')
    var endDash = new EndDash()
    expect(endDash.getHTMLTemplate("testing")).to.be(" <div class='test'></div> ")
  })
})

describe("binding a new model on the page", function() {
  it("should store the scripts of type EndDash as a template", function() {

    var html = '<script type="EndDash" name="helloWorld">' +
              ' <div class="name-"></div>' +
              '</script>'
  , $ = window.$
    window.document.body.innerHTML = html
    var EndDash = require('../lib/end-dash')
    var endDash = new EndDash()
    var template = endDash.createTemplate("helloWorld", {name: "Devon"})
    window.document.body.innerHTML = template.template
    expect($($('#test')).text()).to.be("Devon")
  })
})

