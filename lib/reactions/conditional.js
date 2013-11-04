var Reaction = require("../reaction"),
    rules = require("../rules"),
    _ = require("underscore");

var ConditionalReaction = Reaction.extend({

  init: function(next) {
    this.setConditional();
    next();
  },

  setConditional: function() {
    var shown = _(this.conditionals).every(function(isNegation, conditionalName) {
      //xor(^) in place of && + ||
      return isNegation ^ !!this.get(conditionalName);
    }, this);

    if(shown) {
      this.el.show();
    } else {
      this.el.hide();
    }
  },

  observe: function() {
    var events = _.keys(this.conditionals).join(" ");
    this.change(events, function() {
      this.setConditional();
    }, this);
  }
}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.conditional(el);
  },

  parse: function(el) {
    return {
      conditionals: rules.conditionals(el)
    };
  }
});

module.exports = ConditionalReaction;
