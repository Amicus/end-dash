var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , _ = require("underscore")

var ConditionalReaction = Reaction.extend({

  init: function(next) {
    this.set()
    next()
  },

  set: function() {
    var shown = _(this.conditionals).every(function(isNegation, conditionalName) {
      //xor(^) in place of && + ||
      return isNegation ^ !!get(this.presenter, conditionalName)
    }, this)

    if(shown) {
      this.el.show()
    } else {
      this.el.hide()
    }
  },

  observe: function() {
    if(this.presenter.on) {
      var events = " change:" + _.keys(this.conditionals).join(" change:")
      this.presenter.on(events, function() {
        this.set()
      }, this)
    }
  }
}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.conditional(el)
  },

  parse: function(el) {
    return {
      conditionals: rules.conditionals(el),
    }
  }
})

module.exports = ConditionalReaction
