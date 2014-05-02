require('./support/helper');

var Model = require('../lib/end-dash').Backbone.Model,
    Collection = require('../lib/end-dash').Backbone.Collection,
    expect = require("expect.js"),
    generateTemplate = require("./support/generate_template"),
    fs = require('fs');

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

  describe("with a template with a collection reaction", function(){
    beforeEach(function(){
      this.things = new Collection([
        new Model({ type: "awesome" }),
        new Model({ type: "cool" })
      ]);

      var markup = fs.readFileSync(__dirname + "/support/templates/polymorphic.html").toString();
      this.things.name = 'blo'
      this.template = generateTemplate({things: this.things}, markup);

      this.template.cleanup();
    });

    it("Does not react", function(){
      this.things.add(new Model({type: "awesome"}));
      expect($('[data-each]').children().length).to.be(2);

      this.things.reset();
      expect($('[data-each]').children().length).to.be(2);
    });

    it("it does not error when you remove the HTML and then remove a model ", function(){
      $('.things-').remove()
      this.things.pop();
      // This is a very specific bug
      // JQuery#remove, destroys all listeners/properties from the
      // elements it removes. Without #cleanup, changing the things
      // collection after #remove will error because the looping reaction
      // attempts to delete the DOM element that corrospends to the model
      // removed. Which is no longer there. Thus undefined.el.remove -> error
    })
  });

});
