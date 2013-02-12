var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , generateTemplate = require("./util").generateTemplate

describe("A conditional tag", function() {
  beforeEach(function() {
    this.model = new Backbone.Model({})
  })
  it("should not be visible when false", function () {
    var template = generateTemplate(this.model, '<div><div class="hasThing-"></div><div class="isSet-"></div></div>')

    expect($(".isSet-").is(":visible")).to.be(false)

    this.model.set({ set: true, thing: true })
    expect($(".isSet-").is(":visible")).to.be(true)

    this.model.set({ set: false, thing: false })
    expect($(".isSet-").is(":visible")).to.be(false)
  })
})
