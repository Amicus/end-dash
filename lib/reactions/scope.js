var Reaction = require("../reaction")
  , util = require("../util")
  , rules = require("../rules")

var ScopeReaction = Reaction.extend({
  selector: "[data-scope]",

  setupScope: function(el, model, state) {
    state.modelStack = util.execPathOnStack(state.modelStack, el.attr("data-scope"))
  }
})

module.exports = ScopeReaction  
