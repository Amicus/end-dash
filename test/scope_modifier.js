require('./support/helper');

var expect = require("expect.js"),
    fs = require("fs"),
    generateTemplate = require("./support/generate_template"),
    Model = require('../lib/end-dash').Backbone.Model;

describe("An template", function() {
  describe("which has data-scope attributes", function() {
    before(function() {
      this.dude = new Model({name: 'dude'});
      this.item = new Model({name: 'item'});
      this.thing = new Model({name: 'thing', dude: this.dude, item: this.item});
      this.model = new Model({name: 'model', thing: this.thing, item: this.item});
      this.sock = new Model({name: 'sock'});
      this.boot = new Model({name: 'boot', sock: this.sock});
      this.root = new Model({name: 'root', boot: this.boot, model: this.model});
      this.template = generateTemplate(this.root, fs.readFileSync(__dirname + "/support/templates/scopes.html").toString());
    });

    it("should be able to access the root scope", function() {
      expect($("#rootName").html()).to.be("root");
    });

    it("should be able to access child models of the root scope", function() {
      expect($("#modelName").html()).to.be("model");
    });

    it("should be able to access a relative scope", function() {
      expect($("#thingName").html()).to.be("thing");
    });

    it("should update a relative scope after it changes", function(){
      expect($("#thingName").html()).to.be("thing");
    })

    it("should be able to access a model after relative scope", function() {
      this.thing.set('item', new Model({name: 'Lebron'}));
      this.model.set('item', new Model({name: 'Lebron'}));
      expect($("#itemName").html()).to.be("Lebron");

      this.thing.set('item', new Model({name: 'Bill'}));
      this.model.set('item', new Model({name: 'Bill'}));
      expect($("#itemName").html()).to.be("Bill");
    });

    it("should be able to modify the scope of a model", function() {
      expect($("#sockName").html()).to.be("sock");
    });

    it("should update properly when changing the parent model the scope of a model", function() {
      this.boot.set('sock', new Model({name: 'Bryant'}))
      expect($("#sockName").html()).to.be("Bryant");
    });
  });
});
