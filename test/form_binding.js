var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , generateTemplate = require("./util").generateTemplate

describe("when the template has a form element", function() {
  it("should update the model when it changes to it's change", function() {
    var model = new Backbone.Model({ name: "old" })
      , markup = '<div class = "model-"><input type="text" class = "name-"></div>'
      , template = generateTemplate({ model: model }, markup)

    $(".name-").val("new").change()
    expect(model.get("name")).to.be("new")
  })
})
