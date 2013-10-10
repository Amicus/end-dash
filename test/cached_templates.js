_ = require('underscore')
  , expect = require("expect.js")
  , jsdom = require("jsdom")
  , Backbone = require("backbone")

require("./helper")

describe("loading EndDash on a page with scripts of type EndDash", function() {
  it("should cause EndDash to store the templates with the right name", function() {
    var html =  '<div> This is the main body </div>' +
                '<script type="EndDash" name="testing">' +
                  ' <div class="test"></div>' +
                '</script>'
      , $ = window.$
    window.document.body.innerHTML = html
    var EndDash = require('../lib/end-dash')
    var endDash = new EndDash()
    expect(endDash.getHTMLTemplate("testing")).to.be('<div class="test"></div>')
  })
})

describe("When creating a new template", function() {
  it("EndDash should return a template with the model passed in bound to the DOM elements", function() {
    var html = '<script type="EndDash" name="helloWorld">' +
              ' <div class="name-"></div>' +
              '</script>'
  , $ = window.$
    window.document.body.innerHTML = html
    var EndDash = require('../lib/end-dash')
    var endDash = new EndDash()
    var model = new Backbone.Model({name: "Devon"})
    var template = endDash.createTemplate("helloWorld", model)
    $("body").html(template.template)
    expect($($('.name-')).text()).to.be("Devon")
    model.set("name", "Brian")
    expect($($('.name-')).text()).to.be("Brian")
  })
})

