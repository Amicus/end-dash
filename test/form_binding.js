require('./support/helper');

var expect = require("expect.js"),
    Backbone = require("backbone"),
    generateTemplate = require("./support/generate_template");

describe("when the template has an input", function() {
  it("should update the model when the DOM changes", function() {
    var model = new Backbone.Model({ name: "old" }),
        markup = '<div class = "model-"><input type="text" class = "name-"></div>',
        template = generateTemplate({ model: model }, markup);

    $(".name-").val("new").change();
    expect(model.get("name")).to.be("new");
  });
  it("should update the DOM with a radio button to the value of the model", function() {
    var model = new Backbone.Model({ name: 1 }),
        markup = '<div class = "model-">' +
                   '<input type="radio" name="name" class="name-" value="1">' +
                   '<input type="radio" name="name" class="name-" value="2">' +
                 '</div>',
        template = generateTemplate({ model: model }, markup);

    expect($("input:nth-child(1)").is(":checked")).to.be(true);
    expect($("input:nth-child(2)").is(":checked")).to.be(false);
    model.set("name", 2);
    expect($("input:nth-child(1)").is(":checked")).to.be(false);
    expect($("input:nth-child(2)").is(":checked")).to.be(true);
  });
});
describe("when the template has a select input", function() {
  it("should update the model when it changes to it's change");
  var originalTestFunctionForWhenNotPending = function() {
    var model = new Backbone.Model({ val: "2" }),
        markup = '<div class="model-"><select class="val-">' +
                   '<option id="opt1" value="1">1</option>' +
                   '<option id="opt2" value="2">2</option>' +
                 '</select></div>',
        template = generateTemplate({ model: model }, markup);

    expect(model.get("val")).to.be("2");
    $("#opt1").click();
    expect(model.get("val")).to.be("1");
  };
});
