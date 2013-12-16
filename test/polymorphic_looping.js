require('./support/helper');

var expect = require('expect.js'),
    Backbone = require('../lib/backbone'),
    generateTemplate = require('./support/generate_template');

describe('A collection template with polymorphic attributes', function() {
  var markup =
    '<ul data-each class="rolePolymorphic-">'+
    '  <div class="#{tag} whenSuperhero-">I\'ll save you!</div>'+
    '  <div class="#{tag} whenSupervillain-">I wont\'t.</div>'+
    '  <div class="#{tag} default">I am going to run.</div>'+
    '</ul>';

  describe('backed by a regular object', function() {
    beforeEach(function() {
      var characters = [
        {name: 'Superman', tag: 'superman', role: 'superhero'},
        {name: 'Dr. Octopus', tag: 'doc-oc', role: 'supervillain'},
        {name: 'Joe Schmoe', tag: 'villager', role: 'n/a'}
      ];

      generateTemplate(characters, markup);
    });

    it('renders children with the correct branches', function() {
      expect($('.superman.whenSuperhero-')).not.to.be.empty();
      expect($('.doc-oc.whenSupervillain-')).not.to.be.empty();
      expect($('.villager.default')).not.to.be.empty();
    });
  });

  describe('backed by a backbone object', function() {
    var characters;
    beforeEach(function() {
      characters = new Backbone.Collection([
        new Backbone.Model({name: 'Superman', tag: 'superman', role: 'superhero'}),
        new Backbone.Model({name: 'Dr. Octopus', tag: 'doc-oc', role: 'supervillain'}),
        new Backbone.Model({name: 'Joe Schmoe', tag: 'villager', role: 'n/a'})
      ]);

      generateTemplate(characters, markup);
    });

    it('renders children with the correct branches', function() {
      expect($('.superman.whenSuperhero-')).not.to.be.empty();
      expect($('.doc-oc.whenSupervillain-')).not.to.be.empty();
      expect($('.villager.default')).not.to.be.empty();
    });

    it('updates the case if the switch value changes', function() {
      expect($('.superman.whenSuperhero-')).not.to.be.empty();
      characters.findWhere({name: 'Superman'}).set('role', 'supervillain');
      expect($('.superman.whenSupervillain-')).not.to.be.empty();
    });
  });
});
