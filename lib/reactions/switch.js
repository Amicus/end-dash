var Reaction = require("../reaction"),
    rules = require("../rules"),
    _ = require("underscore");

var SwitchReaction = Reaction.extend({

  init: function(next) {
  },

  observe: function() {
  }
}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.conditional(el);
  },

});

module.exports = SwitchReaction;
