var expect = require("expect.js")
  , jsdom = require("jsdom")
  , Backbone = require("backbone")
  , EndDash = require('../../lib/end-dash')
  , Aggregator = require('../../lib/server_side_dash/aggregator.js')
  , fs = require('fs')

require("../helper")
_ = require('underscore') //Global for EndDash



describe("With a set of templates in a directory aggregated to one file", function(){
  beforeEach(function(){
    var aggregator = new Aggregator({templateDir: __dirname + "/../support/templates/", serveRoot: __dirname})
    aggregator.loadFiles()
  })
  afterEach(function(){
    fs.unlinkSync(__dirname + '/EndDashTemplates.js')
  })

  describe("With a web page with EndDash and the templates loaded", function(){
    beforeEach(function(){
      var html = fs.readFileSync(__dirname + "/EndDashTemplates.js", 'utf8')
        , $ = window.$
      window.document.body.innerHTML = html
      EndDash.clearAndReload()
    })

    it("should load the templates into EndDash", function(){
      expect(EndDash.isLoaded("homepage/intro_content")).to.be(true)
      expect(EndDash.isLoaded("ordered_list")).to.be(true)
      expect(EndDash.isLoaded("show")).to.be(true)
    })

    it("should allow template creation", function(){
      var model = new Backbone.Model({name: "Servus"})
      var template = EndDash.bindTemplate("show", model)
      $('body').html(template.template)
      expect($($('#A')).text()).to.be("Servus")
    })

    it("should correctly handle nexted templates", function(){
      var model = new Backbone.Model({name: "Servus"})
      var template = EndDash.bindTemplate("homepage/intro_content", model)
      $('body').html(template.template)
      expect($($('#A')).text()).to.be("Servus")
    })
  })
})