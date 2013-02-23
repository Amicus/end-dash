var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")

var ConditionalReaction = Reaction.extend({

  init: function(next) {
    this.set()
    next()
  },

  set: function() {
    //xor(^) in place of && + ||
    if(this.negation ^ !!get(this.model, this.conditionalName)) {
      this.el.show()
    } else {
      this.el.hide()
    }
  },

  observe: function() {
    this.presenter.on("change:" + this.conditionalName, function() {
      this.set()
    }, this)
  }
}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.conditional(el)
  },

  parse: function(el) {
    return {
      conditionalName: rules.conditional(el),
      negation: rules.negation(el)
    }
  }
})

module.exports = ConditionalReaction
