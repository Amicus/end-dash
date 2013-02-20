var Reaction = require("../reaction")
  , util = require("../util")
  , rules = require("../rules")

var ScopeReaction = Reaction.extend({
  init: function(el, model, stack, next) {
    stack = util.execPathOnStack(stack, el.attr("data-scope"))
    next(stack)
  }
}, {
  selector: "[data-scope]"
})

module.exports = ScopeReaction  
