var Reaction = require("../reaction"),
    rules = require("../rules"),
    util = require('../util');

var ComponentReaction = Reaction.extend({
  name: 'component',
  init: function(next) {
    var Component = require(this.componentPath);
    var component = new Component({ model: model });
    this.el.html(component.el);
  },

}, {
  selector: "[data-component]",

  parse: function(el, state) {
    return {
      componentPath: el.attr('data-component')
    };
  }
});

module.exports = ModelReaction; 
