var expect = require("expect.js")
  , jsdom = require("jsdom")
  , Backbone = require("backbone")
  , EndDash = require('../lib/end-dash')
  , fs = require('fs')
  , util = require("./util")

_ = require('underscore')

var partials = fs.readFileSync(__dirname + "/support/partials.html", 'utf8')
var embedded_partial = fs.readFileSync(__dirname + "/support/embedded_partial.html", 'utf8')
var list_item = fs.readFileSync(__dirname + "/support/list_item.html", 'utf8')
var scopes = fs.readFileSync(__dirname + "/support/scopes.html", 'utf8')

describe("With a set of templates loaded into EndDash", function(){
  beforeEach(function(){
    EndDash.registerTemplate("partials", partials)
    EndDash.registerTemplate("embedded_partial.html", embedded_partial)
    EndDash.registerTemplate("list_item.html", list_item)
    EndDash.registerTemplate("scopes", scopes)
  })

  it("should have all the teamples interanlly", function(){
    expect(EndDash.isTemplateLoaded("partials")).to.be(true)
    expect(EndDash.isTemplateLoaded("embedded_partial.html")).to.be(true)
    expect(EndDash.isTemplateLoaded("list_item.html")).to.be(true)
    expect(EndDash.isTemplateLoaded("scopes")).to.be(true)
  })

  it("should be possible to return a template class", function() {
    var templateClass = EndDash.getTemplateClass("partials")
    expect(typeof templateClass).to.be('function')
    templateClass = EndDash.getTemplate("partials")
    expect(typeof templateClass).to.be('function')
  }) //This functionality is tested by test/util.js via the function GenerateTemplate

  describe("Binding a template on the page", function(){
    beforeEach(function(){
      this.items = new Backbone.Collection()
      this.item1 = new Backbone.Model({variable: "Candy"})
      this.item2 = new Backbone.Model({variable: "Cane"})
      this.item3 = new Backbone.Model({variable: "Good"})
      this.items.add(this.item1)
      this.items.add(this.item2)
      this.items.add(this.item3)
      this.root = new Backbone.Model({items: this.items, thing: {name: "very"}})
      this.template = EndDash.bindTemplate("partials", this.root)
    })
    it("EndDash should fill in the model values in the template", function(){
      expect($('.item-:nth-child(1) div', this.template.el).text()).to.be("Candy")
      expect($('.item-:nth-child(2) div', this.template.el).text()).to.be("Cane")
      expect($('.item-:nth-child(3) div', this.template.el).text()).to.be("Good")
      expect($('.name-', this.template.el).text()).to.be("very")
    })
    it("Should update when a model changes", function(){
      this.item1.set("variable", "Steak")
      expect($('.item-:nth-child(1) div', this.template.el).text()).to.be("Steak")
      this.item2.set("variable", "Also")
      expect($('.item-:nth-child(2) div', this.template.el).text()).to.be("Also")
    })
  })
})

describe('With a set of EndDash templates on a page', function(){
  beforeEach(function() {
    var html =  '<div> This is the main body </div>' +
                  '<script type="EndDash" name="testing">' +
                    ' <div class="test"></div>' +
                  '</script>' +
                  '<div> This is just normal content on the page </div>' +
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
    EndDash.clearAndReload()
  })

  it("should cause EndDash to store the templates with the right name", function() {
    var TemplateClass = EndDash.getTemplate("testing")
    var template = new TemplateClass({name: "Drake"})
    expect(util.outerHTML(template.el)).to.be('<div class="test"></div>')
  })

  describe("with no EndDash templates", function(){
    beforeEach(function(){
      var html =  '<div> This is the main body </div>'
      window.document.body.innerHTML = html
    })

    it(" should be handled gracefully", function(){
      EndDash.clearAndReload()
    })
  })

  describe('and then binding a template to a model', function() {
    beforeEach(function() {
      var html = '<script type="EndDash" name="helloWorld">' +
                ' <div class="name-"></div>' +
                '</script>'
      window.document.body.innerHTML = html
      EndDash.clearAndReload()
    })

    it("should bind as normal", function() {
      var model = new Backbone.Model({name: "Devon"})
      var template = EndDash.bindTemplate("helloWorld", model)
      $("body").html(template.template)
      expect($($('.name-')).text()).to.be("Devon")
      model.set("name", "Brian")
      expect($($('.name-')).text()).to.be("Brian")
    })
  })

  describe("and rendering a template with partials", function(){
    it("Should bind model to template as normal", function(){
      var bossPerson = new Backbone.Model({firstName: "Alec", lastName: "Baldwin"})
      var template = EndDash.bindTemplate("mainContent", bossPerson)
      $("body").html(template.template)
      expect($("#A").text()).to.be(bossPerson.get('firstName'))
      expect($("#B").text()).to.be(bossPerson.get('lastName'))
    })
  })
})


