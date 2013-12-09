require('./support/helper');

var expect = require("expect.js"),
    generateTemplate = require("./support/generate_template"),
    Backbone = require('../lib/end-dash').Backbone;

require("../lib/template");

describe("Setting a single variable", function() {
  before(function() {
    this.markup = '<div>' +
                 '  <select class="number-">' +
                 '    <optgroup data-scope="/numbers" data-each>' +
                 '      <option value="#{num}" class="word-"></option>' +
                 '    </optgroup>' +
                 '  </select>' +
                 '</div>'
  })


  it("should be set in the html", function () {
    var numbers = new Backbone.Collection([
      { num: 1, word: 'one' },
      { num: 2, word: 'two' },
      { num: 3, word: 'three' }
    ])
    var template = generateTemplate({ number: 2, numbers: numbers }, this.markup);

    expect($('.number-').val()).to.equal('2')
  });

});
