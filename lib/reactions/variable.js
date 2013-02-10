var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")

var VariableReaction = Reaction.extend({
  selector: "[class]",

  reactIf: function(el) {
    return this.state.variableName = rules.variable(el)
  },

  parse: function(el) {
    this.state.isInput = el.is(":input:not(button)")
  },

  setFrom: function(el, model, key) {
    if(this.state.isInput) {
      $(el).val(get(model, key))
    } else {
      $(el).html(get(model, key))
    }
  }, 

  init: function(el, model) {
    this.setFrom(el, model, this.state.variableName)
  },

  observe: function(el, model) {
    var key = this.state.variableName
    model.on("change:" + key, function() {
      this.setFrom(el, model, key)
    }, this)
  }
})

module.exports = VariableReaction
