require('./support/helper');

var path = require("path"),
    expect = require("expect.js"),
    fs = require("fs"),
    Backbone = require("backbone"),
    generateTemplate = require("./support/generate_template");

describe("A conditional attribute", function() {

  beforeEach(function() {
    this.model = new Backbone.Model({});
  });

  it("should be set correctly", function () {
    var markup = '<div id="el" class="#{set ? omgYes}"></div>',
        template = generateTemplate(this.model, markup);

    expect($("#el").attr("class")).to.be("");

    this.model.set("set", true);
    expect($("#el").attr("class")).to.be("omgYes");

    this.model.set("set", false);
    expect($("#el").attr("class")).to.be("");
  });

  it("should handle else replacement values", function() {
    var markup = '<div id="el" class="#{set ? omgYes : omgNo }"></div>',
        template = generateTemplate(this.model, markup);

    this.model.set("set", false);
    expect($("#el").attr("class")).to.be("omgNo");

    this.model.set("set", true);
    expect($("#el").attr("class")).to.be("omgYes");
  });

  it("should default to the key if set to a boolean true", function() {
    var markup = '<div id="el" class="#{set}"></div>',
        template = generateTemplate(this.model, markup);

    this.model.set("set", false);
    expect($("#el").attr("class")).to.be("");

    this.model.set("set", true);
    expect($("#el").attr("class")).to.be("set");
  });
});
