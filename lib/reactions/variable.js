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

  init: function(el, model) {
    var variableName = this.state.variableName
      , isInput = this.state.isInput

    function set() {
      if(isInput) {
        $(el).val(get(model, variableName))
      } else {
        $(el).html(get(model, variableName))
      }
    }
    set()

    if(model && typeof model.on === "function") {
      model.on("change:" + variableName, set)
    }
  }
})

module.exports = VariableReaction
