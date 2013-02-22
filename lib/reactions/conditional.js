var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")

var ConditionalReaction = Reaction.extend({

  init: function(el, model, stack, next) {
    this.set(el, model)
    next(stack)
  },

  set: function(el, model) {
    //xor(^) in place of && + ||
    if(this.negation ^ !!get(model, this.conditionalName)) {
      el.show()
    } else {
      el.hide()
    }
  },

  observe: function(el, model) {
    model.on("change:" + this.conditionalName, function() {
      this.set(el, model)
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
