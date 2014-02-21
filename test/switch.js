require('./support/helper');

var expect = require('expect.js'),
    Backbone = require('../lib/end-dash').Backbone,
    generateTemplate = require('./support/generate_template');

describe('A collection template with data-switch attributes', function() {
  var markup =
    '<ul data-each data-switch="role">'+
    '  <div data-when="superhero" class="#{tag} #{role}">I\'ll save you!</div>'+
    '  <div data-when="supervillain" class="#{tag} #{role}">I will not.</div>'+
    '  <div data-else class="#{tag} #{role}">I am going to run.</div>'+
    '</ul>';

  describe('backed by a regular object', function() {
    beforeEach(function() {
      var characters = [
        {name: 'Superman', tag: 'superman', role: 'superhero'},
        {name: 'Dr. Octopus', tag: 'doc-oc', role: 'supervillain'},
        {name: 'Joe Schmoe', tag: 'villager', role: 'NA'}
      ];

      generateTemplate(characters, markup);
    });

    it('renders children with the correct branches', function() {
      expect($('.superman.superhero').text()).to.match(/save/)
      expect($('.doc-oc.superhero')).to.be.empty();
      expect($('.doc-oc.supervillain').text()).to.match(/will not/)
      expect($('.superman.supervillain')).to.be.empty();
      expect($('.villager')).not.to.be.empty();
    });
  });

  describe('backed by a backbone object', function() {
    var characters;
    beforeEach(function() {
      characters = new Backbone.Collection([
        new Backbone.Model({name: 'Superman', tag: 'superman', role: 'superhero'}),
        new Backbone.Model({name: 'Dr. Octopus', tag: 'doc-oc', role: 'supervillain'}),
        new Backbone.Model({name: 'Joe Schmoe', tag: 'villager', role: 'NA'})
      ]);

      generateTemplate(characters, markup);
    });

    it('renders children with the correct branches', function() {
      expect($('.superman.superhero').text()).to.match(/save/)
      expect($('.doc-oc.superhero')).to.be.empty();
      expect($('.doc-oc.supervillain').text()).to.match(/will not/)
      expect($('.superman.supervillain')).to.be.empty();
      expect($('.villager')).not.to.be.empty();
    });

    it('updates the case if the switch value changes', function() {
      expect($('.superman.superhero').text()).to.match(/save/)
      characters.findWhere({name: 'Superman'}).set('role', 'supervillain');
      expect($('.superman.supervillain').text()).to.match(/will not/)
    });
  });
});
