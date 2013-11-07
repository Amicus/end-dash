require('../support/helper');

var expect = require("expect.js"),
    fs = require("fs"),
    generateTemplate = require("../support/generate_template");

describe("An enumerable template", function() {

  it("should set all the values in the html", function () {
    var model = { people: [{name: "Zach"}, {name: "Dog"}] },
        template = generateTemplate(model, fs.readFileSync(__dirname + "/templates/enumerable.html").toString());

    expect($(".people- .person-:nth-child(1) .name-").html()).to.be("Zach");
    expect($(".people- .person-:nth-child(2) .name-").html()).to.be("Dog");
  });

  it("should make the collection empty", function () {
    var model = { people: [] },
        template = generateTemplate(model, fs.readFileSync(__dirname + "/templates/enumerable.html").toString());

    expect($(".people-").children().length).to.be(0);
  });
});
