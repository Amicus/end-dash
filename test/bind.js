require('./support/helper');

var expect = require("expect.js"),
    Backbone = require('../lib/end-dash').Backbone,
    Model = Backbone.Model,
    Collection = Backbone.Collection,
    generateTemplate = require("./support/generate_template");

describe("When I initialize a template with a model", function() {

  beforeEach(function() {
    this.model = new Model({ ohHi: "Hello There" });
    this.template = generateTemplate(this.model, '<div class = "ohHi-"></div>');
  });

  it("should bind to the values", function () {
    expect($(".ohHi-").html()).to.be("Hello There");
  });

  it("should watch for changes to models", function() {
    expect($(".ohHi-").html()).to.be("Hello There");
    this.model.set("ohHi", "Good bye");
    expect($(".ohHi-").html()).to.be("Good bye");
  });
});

describe("when I initialize a collection", function() {

  beforeEach(function() {
    this.models = new Collection([new Model({ name: "Hawg" })]);
    this.markup = '<ul class="peeps-"><li data-each><div><div class="name-"></div></div></li></ul>';
    this.template = generateTemplate({ peeps: this.models }, this.markup);
  });

  it("should bind to a collection", function () {
    this.models.add(new Model({ name: "Dawg" }));
    expect($(".peeps- li div:nth-child(1) .name-").html()).to.be("Hawg");
    expect($(".peeps- li div:nth-child(2) .name-").html()).to.be("Dawg");
  });

  it("should bind to a collection's changes", function () {
    expect($(".peeps- li div:nth-child(1) .name-").html()).to.be("Hawg");
    expect($(".peeps- li div:nth-child(2) .name-").html()).to.be(undefined);

    this.models.add(new Model({ name: "Dawg" }));
    expect($(".peeps- li div:nth-child(1) .name-").html()).to.be("Hawg");
    expect($(".peeps- li div:nth-child(2) .name-").html()).to.be("Dawg");

    this.models.shift();
    expect($(".peeps- li div:nth-child(1) .name-").html()).to.be("Dawg");
    expect($(".peeps- li div:nth-child(2) .name-").html()).to.be(undefined);
  });
});
