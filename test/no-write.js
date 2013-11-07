require('./support/helper');

var Model = require("backbone").Model,
    expect = require("expect.js"),
    generateTemplate = require("./support/generate_template");

describe("An element with data-readonly", function() {

  it("should not change the model on input", function () {
    var model = new Model({ herp: "derp" }),
        markup = '<div><input class="herp-" data-readonly /></div>',
        template = generateTemplate(model, markup);

    $(".herp-").val("notDerp").change();

    expect(model.get("herp")).to.not.be("notDerp");
    expect(model.get("herp")).to.be("derp");
  });
});

