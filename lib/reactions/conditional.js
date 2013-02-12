var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")

var ConditionalReaction = Reaction.extend({
  selector: "[class]",

  reactIf: function(el) {
    return this.state.conditionalName = rules.conditional(el)
  },

  init: function(el, model) {
    if(get(model, this.state.conditionalName)) 
      el.show()
    else
      el.hide()
  },

  observe: function(el, model) {
    model.on("change:" + this.state.conditionalName, function() {
      this.init(el, model)
    }, this)
  }
})

module.exports = ConditionalReaction 
