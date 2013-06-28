var path = require("path")
  , Model = require("backbone").Model
  , expect = require("expect.js")
  , fs = require("fs")
  , generateTemplate = require("./util").generateTemplate

require("./helper")

describe("When I clean up a template", function() { 
  it("should remove listeners from the model on a variable", function() {
    var model = { person: new Model({ name: "zach" }) }
      , markup = '<div class="person-"><div class="name-"></div></div>'
      , template = generateTemplate(model, markup)

    expect($(".name-").html()).to.be("zach")

    template.cleanup()
    model.person.set("name", "devin")

    expect($(".name-").html()).to.not.be("devin")
    expect($(".name-").html()).to.be("zach")
  })

  it("should remove listeners from the element on an input", function() {
    var model = { person: new Model({ name: "zach" }) }
      , markup = '<div class="person-"><input class="name-"></div>'
      , template = generateTemplate(model, markup)

    expect(model.person.get("name")).to.be("zach")
    template.cleanup()
    $(".name-").val("devin").change()

    expect(model.person.get("name")).to.not.be("devin")
    expect(model.person.get("name")).to.be("zach")
  }) 

  it("should not remove other peoples listeners", function(done) {
    var model = { person: new Model({ name: "zach" }) }
      , markup = '<div class="person-"><input class="name-"></div>'
      , template = generateTemplate(model, markup)

    model.person.once("change:property", function() {
      done()
    })

    template.cleanup()

    model.person.set("property", "stuff")
  })
})
