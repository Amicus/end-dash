var path = require("path")
  , expect = require("expect.js")
  , generateTemplate = require("./util").generateTemplate

require("../lib/template")

describe("Setting a single variable", function() {

  it("should be set in the html", function () {
    var template = generateTemplate({ singleVariable: "this is value" }, '<div class = "singleVariable-"></div>')
    expect($(".singleVariable-").html()).to.be("this is value")
  })

  it("should be set in the html even when nested in other elements", function () {
    var template = generateTemplate({ singleVariable: "this is value" }, '<div><div class = "singleVariable-"></div></div>')
    expect($(".singleVariable-").html()).to.be("this is value")
  })

  it("should overwrite existing content", function () {
    var template = generateTemplate({ singleVariable: "this is value" }, '<div><div class = "singleVariable-">derp</div></div>')
    expect($(".singleVariable-").html()).to.not.be("derp")
  })

  it("should set the value on inputs", function() {
    var template = generateTemplate({ singleVariable: "this is value" }, '<div><input class = "singleVariable-" /></div>')
    expect($(".singleVariable-").val()).to.be("this is value")
  })
  
  it("should set the value on select menus for true or false", function() {
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
})
