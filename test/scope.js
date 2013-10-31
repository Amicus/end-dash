require('./support/helper');

var expect = require("expect.js")
  , fs = require("fs")
  , generateTemplate = require("./support/generate_template")
  , Backbone = require('backbone')
  , variableReaction = require('../lib/reactions/variable');

  describe ("With a template that has a polymorphic key but no scope changes", function(){
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
    it("should not record any model/scoping reactions", function(){
      var users = [
                     new Backbone.Model({permissions: 'user'}),
                     new Backbone.Model({permissions: 'admin'})
                  ]
        , collection = new Backbone.Collection(users)
        , savedFn = variableReaction.prototype.init;

      variableReaction.prototype.init = function() {
        throw new Error('Variable reaction should not occur in this scope.js test');
      };

      generateTemplate(collection, this.markup);
      variableReaction.prototype.init = savedFn;


      expect($('[data-each] div:nth-child(1)').html()).to.be("Is User");
      expect($('[data-each] div:nth-child(2)').html()).to.be("Is Admin");
    });
  });

