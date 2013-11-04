require('./support/helper');

var path = require("path")
  , expect = require("expect.js")
  , generateTemplate = require("./support/generate_template")
  , Backbone = require('backbone')

require("../lib/template")

describe("Setting a single variable", function() {

  it("should be set in the html", function () {
    var template = generateTemplate({ singleVariable: "this is value" }, '<div class="test">#{singleVariable}</div>')
    expect($(".test").html()).to.be("this is value")
  })

  it("should be set when it has surrounding text", function () {
    var template = generateTemplate({ singleVariable: "value" }, '<div class="test">This is a #{singleVariable}</div>')
    expect($(".test").html()).to.be("This is a value")
  })

  describe("inputs", function() {
      beforeEach(function() {
        this.model = new Backbone.Model({ singleVariable: "this is value" })
        this.template = generateTemplate(this.model, '<div><input class="singleVariable" value="singleVariable-" /></div>')
        this.el = $('.singleVariable')
      })
      it("should set the value on inputs", function() {
        expect(this.el.val()).to.be("this is value")
      })

      it("should trigger change events on the elements", function(done) {
        this.el.on('change', function () {
            done()
        })
        this.model.set('singleVariable', 'not the other value')
      })
  })

  it("should set the value on select menus when given a string", function() {
    var template = generateTemplate({ singleVariable: "false" },
                                    '<div>' +
                                        '<select class="singleVariable-">' +
                                          '<option value="true">Yes</option>' +
                                          '<option value="false">No</option>' +
                                        '</select>' +
                                      '</div>'
                                    )
    expect($(".singleVariable-").val()).to.be("false")
  })

  it("should set the value on select menus when given a boolean", function() {
    var template = generateTemplate({ singleVariable: false },
                                    '<div>' +
                                        '<select class="singleVariable-">' +
                                          '<option value="true">Yes</option>' +
                                          '<option value="false">No</option>' +
                                        '</select>' +
                                      '</div>'
                                    )
    expect($(".singleVariable-").val()).to.be("false")
  })
})

describe("Setting multiple variables", function() {
  beforeEach(function(){
    this.model = new Backbone.Model({ variableOne: "hello", variableTwo: "goodbye" })
    generateTemplate(this.model, '<div class="test">This is #{variableOne} and #{variableTwo}</div>')
  })

  it("should be set both variables", function () {
    expect($(".test").html()).to.be("This is hello and goodbye")
  })

  it("changing one variable should update the dom", function () {
    this.model.set('variableTwo', 'seeYa')
    expect($(".test").html()).to.be("This is hello and seeYa")
  })

  it("changing the other variable should update the dom", function () {
    this.model.set('variableOne', 'welcome')
    expect($(".test").html()).to.be("This is welcome and goodbye")
  })

  it("changing both variables should update the dom", function () {
    this.model.set('variableOne', 'welcome')
    this.model.set('variableTwo', 'seeYa')
    expect($(".test").html()).to.be("This is welcome and seeYa")
  })
})

describe("Template with interpolated values and nested elements", function() {
    beforeEach(function(){
      this.nestedModel = new Backbone.Model({nestedOne: "I'm nested!"})
      this.model = new Backbone.Model({ variableOne: "hello", variableTwo: "goodbye", nested: this.nestedModel})
      this.markup = '<div class="test"> #{variableOne} ' +
                      '<div class="nested-">' +
                          '#{nestedOne}' +
                      '</div>' +
                      '#{variableTwo}' +
                    '</div>';

      generateTemplate(this.model, this.markup)
    })
    it("should set interpoated values", function () {
      expect($(".test").html().match(/hello/)).to.be.ok()
      expect($(".test").html().match(/goodbye/)).to.be.ok()
    })
    it("should set nested values", function () {
      expect($(".test .nested-").html()).to.be("I'm nested!")
    })
})
