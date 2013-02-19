var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")

var VariableReaction = Reaction.extend({

  parse: function(el) {
    this.isInput = el.is(":input:not(button)")
    this.variableName = rules.variable(el)
  },

  setFrom: function(el, model, key) {
    var newVal = get(model, key)
    if(this.isInput) {
      if(el.attr("type") === "radio")  {
        if(el.val() == newVal) {
          $(el).prop("checked", true)
        }
      } else if(newVal !== $(el).val()) {
        $(el).val(newVal)
      }
    } else {
      $(el).html(newVal)
    }
  }, 

  init: function(el, model) {
    this.setFrom(el, model, this.variableName)
  },

  observe: function(el, model) {
    var key = this.variableName
    if(this.isInput) {
      el.on("input change", function() {
        model.set(key, el.val())
      })
    }

    model.on("change:" + key, function() {
      this.setFrom(el, model, key)
    }, this)
  }
}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.variable(el)
  }
})

module.exports = VariableReaction
