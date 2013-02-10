var Reaction = require("../reaction")
  , get = require("../util").get

var VariableReaction = Reaction.extend({
  selector: "[class]",

  reactIf: function(el) {
    if($(el).children().length === 0) {
      var dashed = $(el).attr("class").match(/(\S+)-/)
      if(dashed && !dashed[1].match(/(^(is|has)|View$)/)) {
        this.state.variableName = dashed[1]
        return true
      }
    }
    return false
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
