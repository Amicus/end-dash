var Model = require("backbone").Model
  , expect = require("expect.js")
  , generateTemplate = require("./util").generateTemplate

require("./helper")

describe("An element with data-readonly", function() {

  beforeEach(function() {})

  it("should not change the model on input", function () {
    var model = new Model({ herp: "derp" })
      , markup = '<div><input class="herp-" data-readonly /></div>'
      , template = generateTemplate(model, markup)

    $(".herp-").val("notDerp").change()

    expect(model.get("herp")).to.not.be("notDerp")
    expect(model.get("herp")).to.be("derp")
  })
})

