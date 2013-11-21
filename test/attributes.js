require('./support/helper');

var Model = require('../lib/backbone').Model,
    expect = require("expect.js"),
    generateTemplate = require("./support/generate_template");

describe("An element with an attribute", function() {
  beforeEach(function() {
    this.markup = '<div><a href="/person/#{name}" id = "link"></a></div>';
  });

  it("should set the attribute", function () {
    var template = generateTemplate({ name: "zach" }, this.markup);
    expect($("#link").attr("href")).to.be("/person/zach");
  });

  it("should update the element's attribute when the model's attribute changes", function() {
    var model = new Model({ name: "zach" }),
        template = generateTemplate(model, this.markup);

    expect($("#link").attr("href")).to.be("/person/zach");

    model.set("name", "newName");
    expect($("#link").attr("href")).to.be("/person/newName");
  });
});

describe("An element with an attribute with multiple interpolations", function() {
  it("should set the attribute", function() {
   var markup = '<a id="link" href="#{one} and #{two}"></a>',
       template = generateTemplate({ one: '1', two: '2' }, markup);

    expect($("#link").attr("href")).to.be("1 and 2");
  });
});

describe("An element with multiple attributes and interpolations", function() {
  it("should set the attribute", function() {
    var markup = '<a id="link" href="#{one} and #{two}" class="#{three}"></a>',
        template = generateTemplate({ one: "1", two: "2", three: "3" }, markup);

    expect($("#link").attr("href")).to.be("1 and 2");
    expect($("#link").attr("class")).to.be("3");
  });
});
