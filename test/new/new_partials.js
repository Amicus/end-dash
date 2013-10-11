_ = require('underscore')
  , expect = require("expect.js")
  , jsdom = require("jsdom")
  , Backbone = require("backbone")
  , EndDash = require('../../lib/end-dash')

require("../helper")

describe("With Endash templates loaded on the page", function() {
  beforeEach(function(){
    var html = '<div> This is just normal content on the page </div>' +
               '<script type=EndDash name="mainContent">' +
               '<div src="calls/template1"></div>' +
               '<div src="analytics/template1"</div>' +
               '</script>' +
               '<script type=EndDash name="calls/template1">' +
               '<div id="A" class="firstName-"></div> the boss <div id="B" class="lastName-"></div>' +
               '</script>' +
               '<script type=EndDash name="analytics/template1">' +
               '<div id="C" class="lastName-"></div> the reverse boss <div id="D" class="firstName-"></div>' +
               '</script>'
      , $ = window.$
      window.document.body.innerHTML = html
      this.endDash = new EndDash()
  })

  describe("Render the partial on the page", function(){
    it("Should correctly render the partials as well the models", function(){
      var bossPerson = new Backbone.Model({firstName: "Alec", lastName: "Baldwin"})
      var template = this.endDash.createTemplate("mainContent", bossPerson)
      $("body").html(template.template)
      expect($("#A").text()).to.be(bossPerson.get('firstName'))
      expect($("#B").text()).to.be(bossPerson.get('lastName'))
    })
  })

})