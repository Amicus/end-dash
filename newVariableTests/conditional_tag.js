require('./support/helper');

var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , generateTemplate = require("./support/generate_template")

describe("A conditional tag", function() {
  beforeEach(function() {
    this.model = new Backbone.Model({})
  })
  it("should not be visible when false", function () {
    var template = generateTemplate(this.model,
    '<div>' +
      '<div class="hasThing-"></div>' +
      '<div class="hasNoThing-"></div>' +
      '<div class="isntSet-"></div>' +
      '<div class="isSet-"></div>'+
    '</div>')

    expect($(".isSet-").is(":visible")).to.be(false)
    expect($(".isntSet-").is(":visible")).to.be(true)
    expect($(".hasThing-").is(":visible")).to.be(false)
    expect($(".hasNoThing-").is(":visible")).to.be(true)

    this.model.set({ set: true, thing: true })
    expect($(".isSet-").is(":visible")).to.be(true)
    expect($(".isntSet-").is(":visible")).to.be(false)
    expect($(".hasThing-").is(":visible")).to.be(true)
    expect($(".hasNoThing-").is(":visible")).to.be(false)

    this.model.set({ set: false, thing: false })
    expect($(".isSet-").is(":visible")).to.be(false)
    expect($(".hasThing-").is(":visible")).to.be(false)
    expect($(".isntSet-").is(":visible")).to.be(true)
    expect($(".hasNoThing-").is(":visible")).to.be(true)
  })
  it("should 'and' two conditionals together", function () {
    var template = generateTemplate(this.model, '<div id="test" class="hasThing- isntSet-"></div>')
      , el = $("#test")

    this.model.set({ set: false, thing: false })
    expect(el.is(":visible")).to.be(false)

    this.model.set({ set: true, thing: false })
    expect(el.is(":visible")).to.be(false)

    this.model.set({ set: false, thing: true })
    expect(el.is(":visible")).to.be(true)

    this.model.set({ set: true, thing: true })
    expect(el.is(":visible")).to.be(false)
  })
})
