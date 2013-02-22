var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")

var VariableReaction = Reaction.extend({

  setFrom: function(el, model, key) {
    var newVal = get(model, key)
    if(this.isInput) {
      if(el.attr("type") === "radio")  {
        if(el.val() == newVal) {
          $(el).prop("checked", true)
        } else {
          $(el).prop("checked", false)
        }
      } else if(newVal !== $(el).val()) {
        $(el).val(newVal)
      }
    } else {
      $(el).html(newVal)
    }
  }, 

  init: function(el, model, stack, next) {
    this.setFrom(el, model, this.variableName)
    next(stack)
  },

  observe: function(el, model) {
    this.el = el
    this.model = model

    var key = this.variableName
    if(this.isInput) {
      el.on("input.endDash change.endDash", function() {
        var mod = (model.model) ? model.model : model
        mod.set(key, el.val())
      })
    }

    model.on("change:" + key, function() {
      this.setFrom(el, model, key)
    }, this)
  },

  stopObserving: function() {
    this.el.off("input.endDash change.endDash")
    this.model.off(null, null, this)
  }
}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.variable(el)
  },
 
  parse: function(el) {
    return {
      isInput: el.is(":input:not(button)"),
      variableName: rules.variable(el)
    }
  },
 
})

module.exports = VariableReaction
