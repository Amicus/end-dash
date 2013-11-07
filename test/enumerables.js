require('./support/helper');

var expect = require("expect.js"),
    fs = require("fs"),
    generateTemplate = require("./support/generate_template");

describe("A collection", function() {

  it("should set all the values in the html", function () {
    var model = { people: [{name: "Zach"}, {name: "Dog"}] },
        template = generateTemplate(model, fs.readFileSync(__dirname + "/support/templates/enumerable.html").toString());

    expect($(".people- li div:nth-child(1)").html()).to.be("Zach");
    expect($(".people- li div:nth-child(2)").html()).to.be("Dog");
  });

  it("should make the collection empty", function () {
    var model = { people: [] },
        template = generateTemplate(model, fs.readFileSync(__dirname + "/support/templates/enumerable.html").toString());

    expect($(".people- li").children().length).to.be(0);
  });
});
