var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , ModelReaction = require("./model")

var VariableReaction = Reaction.extend({

  setFrom: function(key) {
    var newVal = get(this.presenter, key)

    if(this.isInput) {
      if(this.el.attr("type") === "radio")  {
        if(this.el.val() == newVal) {
          $(this.el).prop("checked", true)
        } else {
          $(this.el).prop("checked", false)
        }
      } else if(newVal !== $(this.el).val()) {
        $(this.el).val(newVal)
      }
    } else {
      $(this.el).html(newVal)
    }
  }, 

  init: function(el, model, stack, next) {
    this.el = el
    this.model = model
    this.presenter = ModelReaction.getPresenter(model)

    this.setFrom(this.variableName)
    next(stack)
  },

  observe: function(el, model) {
    var key = this.variableName
      , that = this

    if(this.isInput) {
      el.on("input.endDash change.endDash", function() {
        that.model.set(key, el.val())
      })
    }

    model.on("change:" + key, function() {
      this.setFrom(key)
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
