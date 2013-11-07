require('./support/helper');

var path = require("path"),
    expect = require("expect.js"),
    fs = require("fs"),
    Backbone = require("backbone"),
    generateTemplate = require("./support/generate_template");

describe("A polymporhic template", function() {

  it("looping through a collection will display the correct item given the model type", function() {
    var model = { things: [{ type: "awesome" }, { type: "cool" }] },
        markup = fs.readFileSync(__dirname + "/support/templates/polymorphic.html").toString(),
        template = generateTemplate(model, markup);

    expect($(".things- li div:nth-child(1)").html()).to.be("awesome");
    expect($(".things- li div:nth-child(2)").html()).to.be("cool");

    expect($(".things- li div:nth-child(1)").hasClass("whenAwesome-")).to.be(true);
    expect($(".things- li div:nth-child(2)").hasClass("whenCool-")).to.be(true);
  });

  describe("when I loop through a collection", function() {
    it("the dom will change when a child model type changes", function() {
      var things = new Backbone.Collection([ new Backbone.Model({ type: "awesome" }), new Backbone.Model({ type: "cool" }) ]),
          markup = fs.readFileSync(__dirname + "/support/templates/polymorphic.html").toString(),
          template = generateTemplate({ things: things }, markup);

      expect($(".things- li div:nth-child(1)").html()).to.be("awesome");
      expect($(".things- li div:nth-child(2)").html()).to.be("cool");

      expect($(".things- li div:nth-child(1)").hasClass("whenAwesome-")).to.be(true);
      expect($(".things- li div:nth-child(2)").hasClass("whenCool-")).to.be(true);

      things.at(0).set("type", "cool");
      things.at(1).set("type", "awesome");

      expect($(".things- li div:nth-child(1)").html()).to.be("cool");
      expect($(".things- li div:nth-child(2)").html()).to.be("awesome");

      expect($(".things- li div:nth-child(1)").hasClass("whenCool-")).to.be(true);
      expect($(".things- li div:nth-child(2)").hasClass("whenAwesome-")).to.be(true);
    });
  });
});

describe("A polymorphic template with model reactions", function(){
  beforeEach(function(){
    this.collection = new Backbone.Collection([new Backbone.Model({firstName: "Bill", job: "scientist"}),
                                               new Backbone.Model({kind: "tough", job: "teacher"})
                                              ]);
    this.markup = "<div class='jobPolymorphic-' data-each>" +
                    "<div class='whenScientist-'>" +
                      "Scientists welcome you, signed by <div class='firstName-'></div>" +
                    "</div>" +
                    "<div class='whenTeacher-'>" +
                      "I am your teacher and I am <div class='kind-'></div>" +
                    "</div>" +
                  "</div>";
    generateTemplate(this.collection, this.markup);
  });
  it("will interpolate the values", function(){
    expect($('.jobPolymorphic- div:nth-child(1)').html()).to.be('Scientists welcome you, signed by <div class="firstName-">Bill</div>');
    expect($('.jobPolymorphic- div:nth-child(2)').html()).to.be('I am your teacher and I am <div class="kind-">tough</div>');
  });
});

describe("A polymorphic template with a default case", function(){
  beforeEach(function(){
    this.collection = new Backbone.Collection([new Backbone.Model({firstName: "Bill", job: "scientist"}),
                                               new Backbone.Model({kind: "tough", job: "teacher"}),
                                               new Backbone.Model({name: "Joe", job: ""}),
                                               new Backbone.Model({name: "Rando", job: "93293klsdfsd"})
                                              ]);
    this.markup = "<div class='jobPolymorphic-' data-each>" +
                    "<div class='whenScientist-'>" +
                      "Scientists welcome you, signed by <div class='firstName-'></div>" +
                    "</div>" +
                    "<div class='whenTeacher-'>" +
                      "I am your teacher and I am <div class='kind-'></div>" +
                    "</div>" +
                    "<div>" +
                      "Default here: <div class='name-'></div>" +
                    "</div>" +
                  "</div>";
    generateTemplate(this.collection, this.markup);
  });
  it("will interpolate the values", function(){
    expect($('.jobPolymorphic- div:nth-child(1)').html()).to.be('Scientists welcome you, signed by <div class="firstName-">Bill</div>');
    expect($('.jobPolymorphic- div:nth-child(2)').html()).to.be('I am your teacher and I am <div class="kind-">tough</div>');
    expect($('.jobPolymorphic- div:nth-child(3)').html()).to.be('Default here: <div class="name-">Joe</div>');
    expect($('.jobPolymorphic- div:nth-child(4)').html()).to.be('Default here: <div class="name-">Rando</div>');
  });
});
