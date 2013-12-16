require('./support/helper');

var Model = require('../lib/backbone').Model,
    expect = require("expect.js"),
    generateTemplate = require("./support/generate_template");

describe("When I clean up a template", function() {
  it("should remove listeners from the model on a variable", function() {
    var model = { person: new Model({ name: "zach" }) },
        markup = '<div class="person-"><div class="name-"></div></div>',
        template = generateTemplate(model, markup);

    expect($(".name-").html()).to.be("zach");

    template.cleanup();
    model.person.set("name", "devon");

    expect($(".name-").html()).to.not.be("devon");
    expect($(".name-").html()).to.be("zach");
  });

  it("should remove listeners from the element on an input", function() {
    var model = { person: new Model({ name: "zach" }) },
        markup = '<div class="person-"><input class="name-"></div>',
        template = generateTemplate(model, markup);

    expect(model.person.get("name")).to.be("zach");
    template.cleanup();
    $(".name-").val("devon").change();

    expect(model.person.get("name")).to.not.be("devon");
    expect(model.person.get("name")).to.be("zach");
  });

  it("should not remove other peoples listeners from the model", function(done) {
    var model = { person: new Model({ name: "zach" }) },
        markup = '<div class="person-"><input class="name-"></div>',
        template = generateTemplate(model, markup);

    model.person.once("change:property", function() {
      done();
    });

    template.cleanup();

    model.person.set("property", "stuff");
  });

  it("should not remove other peoples listeners from the element", function(done) {
    var model = { person: new Model({ name: "zach" }) },
        markup = '<div class="person-"><input class="name-" /></div>',
        template = generateTemplate(model, markup);


    $(".name-").one("change", function() {
      done();
    });

    template.cleanup();

    $(".name-").change();
  });

});
