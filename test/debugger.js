var generateTemplate = require('./util').generateTemplate,
    DebuggerReaction = require('../lib/reactions/debugger'),
    Backbone = require('backbone'),
    Model = Backbone.Model,
    expect = require('expect.js');

describe('<div debugger>', function() {
  beforeEach(function() {
    var dog = new Model({name: 'Fido'});

    this.model = new Model({
      name: 'Mukund',
      dog: dog
    });
  });

  describe('in the topmost scope', function() {
    beforeEach(function() {
      var src = '<div debugger></div>';
      this.template = generateTemplate(this.model, src);
    });

    it('calls the debugger when the model is synced', function(done) {
      DebuggerReaction.customDebugger = done;
      this.model.trigger('sync');
    });

    it('passes the template context', function(done) {
      DebuggerReaction.customDebugger = function() {
        expect(this.model.get('name')).to.be('Mukund');
        done();
      };

      this.model.trigger('sync');
    });
  });

  describe('nested in a scope', function() {
    beforeEach(function() {
      var src = '<div class="dog-">'+
                '  <div debugger></div>'+
                '</div>';

      this.template = generateTemplate(this.model, src);
    });

    it('passes the nested context', function(done) {
      DebuggerReaction.customDebugger = function() {
        expect(this.model.get('name')).to.be('Fido');
        done();
      };

      this.model.get('dog').trigger('sync');
    });
  });
});
