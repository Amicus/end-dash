require('../support/helper');

var expect = require("expect.js"),
    fs = require("fs"),
    Backbone = require("backbone"),
    generateTemplate = require("../support/generate_template"),
    Factory = require("test-things").Factory;

describe("when integrating with backbone", function() {
  beforeEach(function() {
    this.markup = fs.readFileSync(__dirname + "/templates/complex_nested.html").toString();
    this.answerFactory = new Factory(Backbone.Model, {
      name: "a{{sequence(1)}}"
    });
    this.questionFactory = new Factory(Backbone.Model, {
      name: "q{{sequence(1)}}",
      answer: this.answerFactory
    });
    this.questionCollectionFactory = this.questionFactory.collectionFactory(Backbone.Collection, 3);
    this.scriptFactory = new Factory(Backbone.Model, {
      name: "the name",
      questions: this.questionCollectionFactory
    });
  });
  describe("I pass a backbone model to set", function() {
    it("should set it's attributes", function() {
      var model = new Backbone.Model({ name: "q1", title: "herp" }),
          markup = '<div><div class = "name-"></div><div class = "title-"></div></div>',
          template = generateTemplate(model, markup);

      expect($(".name-").html()).to.be("q1");
      expect($(".title-").html()).to.be("herp");
    });
  });

  it("it should populate a collection within a model", function() {
    var script = this.scriptFactory.generate(),
        markup = fs.readFileSync(__dirname + "/templates/complex_nested.html").toString(),
        template = generateTemplate({ script: script }, this.markup);

    expect($(".script- .name-:nth-child(1)").html()).to.be("the name");
    script.get("questions").each(function(question, i) {
      expect($(".script- .question-:nth-child(" + (i + 1) + ") > .arb > .name-").html()).to.be(question.get("name"));
      expect($(".script- .question-:nth-child(" + (i + 1) + ") > .answer- > .name-").html()).to.be(question.get("answer").get("name"));
    });
  });

  it("it should update the collection after reset", function() {
    var script = this.scriptFactory.generate({ questions: this.questionCollectionFactory.generate(0) }),
        template = generateTemplate({ script: script }, this.markup);

    script.get("questions").reset(this.questionCollectionFactory.generate().models);

    expect($(".script- .name-:nth-child(1)").html()).to.be(script.get("name"));
    script.get("questions").each(function(question, i) {
      expect($(".script- .question-:nth-child(" + (i + 1) + ") > .arb > .name-").html()).to.be(question.get("name"));
      expect($(".script- .question-:nth-child(" + (i + 1) + ") > .answer- > .name-").html()).to.be(question.get("answer").get("name"));
    });
  });
});
