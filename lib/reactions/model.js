var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")

var ModelReaction = Reaction.extend({
  selector: "[class]",

  reactIf: function(el) {
    return this.state.modelName = rules.model(el)
  },

  parse: function(el) {},

  setupScope: function(el, model, modelStack) {
    modelStack.push(get(model, this.state.modelName))
  }
})

module.exports = ModelReaction 
