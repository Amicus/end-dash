_ = require('underscore')
  , expect = require("expect.js")
  , jsdom = require("jsdom")
  , Backbone = require("backbone")
  , EndDash = require('../lib/end-dash')

  //Still test template starting with text as well as
  //When no templates are on the page

require("./helper")

describe('With EndDash loaded on a page', function(){
  beforeEach(function() {
    var html =  '<div> This is the main body </div>' +
                  '<script type="EndDash" name="testing">' +
                    ' <div class="test"></div>' +
                  '</script>'
        , $ = window.$
    window.document.body.innerHTML = html
    this.endDash = new EndDash()
  })

  describe("loading EndDash on a page with scripts of type EndDash", function() {
    it("should cause EndDash to store the templates with the right name", function() {
      expect(this.endDash.getHTMLTemplate("testing")).to.be('<div class="test"></div>')
    })
  })

  describe("Loading new html onto the page and refreshing EndDash", function() {
    beforeEach(function() {
      var html = '<script type="EndDash" name="helloWorld">' +
                ' <div class="name-"></div>' +
                '</script>'
      window.document.body.innerHTML = html
      this.endDash.reloadTemplates()
    })
    it("EndDash should have the new templates but not the old templates", function() {
      expect(this.endDash.getHTMLTemplate("testing")).to.be(undefined)
      expect(this.endDash.getHTMLTemplate("helloWorld")).to.be('<div class="name-"></div>')
    })
  })

  describe('Binding EndDash to a model on the page should still owrk', function() {
    beforeEach(function() {
      var html = '<script type="EndDash" name="helloWorld">' +
                ' <div class="name-"></div>' +
                '</script>'
      window.document.body.innerHTML = html
      this.endDash.reloadTemplates()
    })
    it("EndDash should return a template with the model passed in bound to the DOM elements", function() {
      var model = new Backbone.Model({name: "Devon"})
      var template = this.endDash.createTemplate("helloWorld", model)
      $("body").html(template.template)
      expect($($('.name-')).text()).to.be("Devon")
      model.set("name", "Brian")
      expect($($('.name-')).text()).to.be("Brian")
    })
  })

})

