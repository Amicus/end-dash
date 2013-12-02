require('./support/helper');

var expect = require("expect.js"),
    fs = require("fs"),
    Backbone = require('../lib/end-dash').Backbone,
    generateTemplate = require("./support/generate_template");

describe("A template with looping", function() {
  describe("bound to a Backbone collection", function() {
    beforeEach(function () {
      this.things = new Backbone.Collection([
        new Backbone.Model({ type: "awesome" }),
        new Backbone.Model({ type: "cool" })
      ]);

      this.markup = fs.readFileSync(__dirname + "/support/templates/polymorphic.html").toString();
      this.template = generateTemplate({ things: this.things }, this.markup);
    });

    it("the dom will update when the type of a child object changes", function() {
      this.things.at(0).set("type", "cool");
      this.things.at(1).set("type", "awesome");

      expect($(".things- li div:nth-child(1)").html()).to.be("cool");
      expect($(".things- li div:nth-child(1)").hasClass("whenCool-")).to.be(true);

      expect($(".things- li div:nth-child(2)").html()).to.be("awesome");
      expect($(".things- li div:nth-child(2)").hasClass("whenAwesome-")).to.be(true);
    });

    describe("whose bound dom elements are moved on the page", function() {
      beforeEach(function(){
        var el = $(".things- li div:nth-child(2)");
        el.insertBefore($('.things- li div:nth-child(1)'));
        expect($('.things- li div:nth-child(1)').html()).to.be('cool');
      });
      it("removing a child will remove the right child object from the dom", function() {
        this.things.remove(this.things[1]);
        expect($(".things- li div:nth-child(1)").html()).to.be("cool");
      });
    });

    it("will support looping through a collection multiple times in a single template", function() {
      var name1 = "Zach",
          name2 = "Dog",
          age1  = "26",
          age2  = "6",
          model = { people: [{name: name1, age: age1}, {name: name2, age: age2}] },
          template = generateTemplate(model, fs.readFileSync(__dirname + "/support/templates/multiple_iteration.html").toString());
      expect($(".people- ul.names li div:nth-child(1)").html()).to.be(name1);
      expect($(".people- ul.names li div:nth-child(2)").html()).to.be(name2);

      expect($(".people- ul.ages li div:nth-child(1)").html()).to.be(age1);
      expect($(".people- ul.ages li div:nth-child(2)").html()).to.be(age2);
    });

    it("will support collection attributes if model's attribute interface is extended to collections", function() {
      var name1 = "Zach",
          name2 = "Dog",
          age1  = "26",
          age2  = "6",
          totalCount = 2,
          model = { people: new Backbone.Collection([{name: name1, age: age1}, {name: name2, age: age2}]) };
      model.people.get = function(attribute) { return totalCount.toString(); };
      var template = generateTemplate(model, fs.readFileSync(__dirname + "/support/templates/multiple_iteration.html").toString());
      expect($(".people- span.totalCount-").html()).to.be(totalCount.toString());
      expect($(".people- ul.names li div:nth-child(1)").html()).to.be(name1);
      expect($(".people- ul.names li div:nth-child(2)").html()).to.be(name2);

      expect($(".people- ul.ages li div:nth-child(1)").html()).to.be(age1);
      expect($(".people- ul.ages li div:nth-child(2)").html()).to.be(age2);
    });
  });

  describe("when I loop through an array literal", function() {
    beforeEach(function () {
      this.things = [
        new Backbone.Model({ type: "awesome" }),
        new Backbone.Model({ type: "cool" })
      ];

      this.markup = fs.readFileSync(__dirname + "/support/templates/polymorphic.html").toString();
      this.template = generateTemplate({ things: this.things }, this.markup);
    });

    it("the items displayed will change when the type changes", function() {
      this.things[0].set("type", "cool");
      this.things[1].set("type", "awesome");

      expect($(".things- li div:nth-child(1)").html()).to.be("cool");
      expect($(".things- li div:nth-child(1)").hasClass("whenCool-")).to.be(true);

      expect($(".things- li div:nth-child(2)").html()).to.be("awesome");
      expect($(".things- li div:nth-child(2)").hasClass("whenAwesome-")).to.be(true);
    });

    describe("whose bound dom elements are moved on the page", function() {
      beforeEach(function(){
        var el = $(".things- li div:nth-child(2)");
        el.insertBefore($('.things- li div:nth-child(1)'));
        expect($('.things- li div:nth-child(1)').html()).to.be('cool');
      });
      it("removing a child will not remove the right child object from the dom", function() {
        this.things.pop();
        expect($(".things- li div:nth-child(1)").html()).to.be("cool");
        expect($(".things- li div:nth-child(2)").html()).to.be("awesome");
      });
    });
  });
});

describe("A template with looping after scoping", function(){
  describe("with an array in a Backbone Model", function(){
    beforeEach(function(){
        this.things = [
          new Backbone.Model({ type: "awesome" }),
          new Backbone.Model({ type: "cool" })
        ];
        this.topLevelObject = new Backbone.Model({ things: this.things });
        this.markup = "<div class='things-'>" +
                          "<div data-each>" +
                            "<div>" +
                              "<div class=type-'>" +
                              "</div>" +
                            "</div>" +
                          "</div>" +
                      "</div>";
        this.template = generateTemplate(this.topLevelObject, this.markup);
    });
    it("looping will change when an object types change", function(){
      this.things[0].set("type", "cool");
      this.things[1].set("type", "awesome");

      expect($(".things- div div:nth-child(1) div").html()).to.be("cool");
      expect($(".things- div div:nth-child(2) div").html()).to.be("awesome");
    });
    it("the dom will not update when objects are removed from the array", function(){
      this.things.pop();
      expect($(".things- div div:nth-child(1) div").html()).to.be("awesome");
    });
    it("the dom will not update when objects are moved in the array", function(){
      var model1 = this.things[0];
      this.things[0] = this.things[1];
      this.things[1] = model1;
      expect($(".things- div div:nth-child(1) div").html()).to.be("awesome");
      expect($(".things- div div:nth-child(2) div").html()).to.be("cool");
    });
  });
});


describe("A template with looping and scoping on the same element", function(){
  describe("with an array of Backbone Models", function(){
    beforeEach(function() {
        this.things = [
          new Backbone.Model({ type: "awesome" }),
          new Backbone.Model({ type: "cool" })
        ];
        this.topLevelObject = new Backbone.Model({ things: this.things });
        this.markup = "<div class='things-' data-each>" +
                         "<div>" +
                           "<div class='type-'>" +
                          "</div>" +
                         "</div>" +
                      "</div>";
        this.template = generateTemplate(this.topLevelObject, this.markup);
    });
    it("it will set the values", function(){
      expect($(".things- div:nth-child(1) .type-").html()).to.be("awesome");
      expect($(".things- div:nth-child(2) .type-").html()).to.be("cool");
    });
  });
});

describe("A template with no looping and no scoping", function(){
  beforeEach(function(){
    this.markup = "<div data-each>" +
                    "<div>" +
                      "<div class=type-'>" +
                      "</div>" +
                    "</div>" +
                  "</div>";
  });
  describe("bound to an array literal containing backbone models", function(){
    beforeEach(function(){
        this.things = [
          new Backbone.Model({ type: "awesome" }),
          new Backbone.Model({ type: "cool" })
        ];
        this.template = generateTemplate(this.things, this.markup);
    });
    it("will interpolate values correctly", function(){
      generateTemplate(this.things, this.markup);

      expect($("div div:nth-child(1) div").html()).to.be("awesome");
      expect($("div div:nth-child(2) div").html()).to.be("cool");
    });
  });
});


