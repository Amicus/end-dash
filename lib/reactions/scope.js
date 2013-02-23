var Reaction = require("../reaction")
  , util = require("../util")
  , rules = require("../rules")

var ScopeReaction = Reaction.extend({
  init: function(next) {
    util.execPathOnStack(this.stack, this.el.attr("data-scope"))
    next()
  }
}, {
  selector: "[data-scope]"
})

module.exports = ScopeReaction  
