var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")

var ConditionalReaction = Reaction.extend({

  init: function(el, model) {
    if(get(model, this.conditionalName)) 
      el.show()
    else {
      el.hide()
    }
  },

  observe: function(el, model) {
    model.on("change:" + this.conditionalName, function() {
      this.init(el, model)
    }, this)
  }
}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.conditional(el)
  },
 
  parse: function(el) {
    return { conditionalName: rules.conditional(el) }
  }
})

module.exports = ConditionalReaction 
