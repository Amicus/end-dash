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

  // describe("inputs", function() {
  //     beforeEach(function() {
  //       this.model = new Backbone.Model({ singleVariable: "this is value" })
  //       this.template = generateTemplate(this.model, '<div><input value="#{singleVariable}" /></div>')
  //     })
  //     it("should set the value on inputs", function() {
  //       expect(this.el.val()).to.be("this is value")
  //     })

  //     it("should trigger change events on the elements", function(done) {
  //       this.el.on('change', function () {
  //           done()
  //       })
  //       this.model.set('singleVariable', 'not the other value')
  //     })
  // })

  
  // it("should set the value on select menus when given a string", function() {
  //   var template = generateTemplate({ singleVariable: "false" }, 
  //                                   '<div>' +
  //                                       '<select class="singleVariable-">' +
  //                                         '<option value="true">Yes</option>' +
  //                                         '<option value="false">No</option>' +
  //                                       '</select>' +
  //                                     '</div>'
  //                                   )
  //   expect($(".singleVariable-").val()).to.be("false")
  // })
  
  // it("should set the value on select menus when given a boolean", function() {
  //   var template = generateTemplate({ singleVariable: false }, 
  //                                   '<div>' +
  //                                       '<select class="singleVariable-">' +
  //                                         '<option value="true">Yes</option>' +
  //                                         '<option value="false">No</option>' +
  //                                       '</select>' +
  //                                     '</div>'
  //                                   )
  //   expect($(".singleVariable-").val()).to.be("false")
  // })
})
