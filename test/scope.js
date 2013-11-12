require('./support/helper');

var expect = require("expect.js"),
    generateTemplate = require("./support/generate_template"),
    Backbone = require('../lib/end-dash').Backbone,
    variableReaction = require('../lib/reactions/variable');

describe('scope', function(){
  describe ("polymorphic key but no scope changes", function(){
    beforeEach(function(){
      this.markup = "<div class='permissionsPolymorphic-' data-each>" +
                      "<div class='whenUser-'>" +
                        "Is User" +
                      "</div>" +
                      "<div class='whenAdmin-'>" +
                        "Is Admin" +
                      "</div>" +
                    "</div>";
    });
    describe('model scoping reactions stubbed out', function(){
      beforeEach(function(){
        var users = [
                      new Backbone.Model({permissions: 'user'}),
                      new Backbone.Model({permissions: 'admin'})
                    ];
        this.savedFn = variableReaction.prototype.init;
        this.collection = new Backbone.Collection(users);
        variableReaction.prototype.init = function() {
          throw new Error('Variable reaction should not occur in this scope.js test');
        };
      });
      afterEach(function(){
        variableReaction.prototype.init = this.savedFn;
      });
      it("should not record user variable interpolation", function(){
        generateTemplate(this.collection, this.markup);
        expect($('[data-each] div:nth-child(1)').html()).to.be("Is User");
      });
      it("should not record admin variable interpolation", function(){
        generateTemplate(this.collection, this.markup);
        expect($('[data-each] div:nth-child(2)').html()).to.be("Is Admin");
      });
    });
  });
  describe ("scope changes", function(){
    beforeEach(function(){
      this.markup = "<div class='bird-'>" +
                      "<div>" +
                        "Is User" +
                      "</div>" +
                    "</div>";
    });
    describe('scope into a number', function(){
      beforeEach(function(){
        this.model = new Backbone.Model({bird: 1});
      });
      it("should not record user variable interpolation", function(){
        var that = this;
        var bindTemplate = function() {
          generateTemplate(that.model, that.markup);
        };
        expect(bindTemplate).to.throwError(/to a number, but templates can only be bound to objects/);
      });
    });
    describe('scope into a string', function(){
      beforeEach(function(){
        this.model = new Backbone.Model({bird: "weee"});
      });
      it("should not record user variable interpolation", function(){
        var that = this;
        var bindTemplate = function() {
          generateTemplate(that.model, that.markup);
        };
        expect(bindTemplate).to.throwError(/ to a string, but templates can only be bound to objects/);
      });
    });
  });
});


