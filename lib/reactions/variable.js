var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , ModelReaction = require("./model")

var VariableReaction = Reaction.extend({

  setFrom: function(key) {
    var newVal = this.get(key)
      , oldVal
      , shouldTriggerChange = false
      , el = $(this.el)

    if(this.isInput) {
      oldVal = el.val()
      if(el.attr("type") === "checkbox") {
        if(el.prop('checked') !== !!newVal) {
          shouldTriggerChange = true
        }
        el.prop("checked", !!newVal)
      } else if(el.attr("type") === "radio") {
        if(oldVal == newVal) {
          if (!el.prop('checked')) {
            shouldTriggerChange = true
          }
          el.prop("checked", true)
        } else {
          if (el.prop('checked')) {
            shouldTriggerChange = true
          }
          el.prop("checked", false)
        }
      } else if(newVal !== oldVal) {
        shouldTriggerChange = true
        //ugly nesting, but have to check for undefined because
        //this gets called by many things and newVal isn't always defined
        if (typeof newVal !== 'undefined') {
          el.val(newVal.toString())
        } else {
          el.val(newVal)
        }
      }
      if (shouldTriggerChange) {
        this.triggerDOMChange()
      }
    } else {
      oldVal = el.html()
      if(oldVal !== newVal) {
        el.html(newVal)
      }
    }
  },

  triggerDOMChange: function () {
      $(this.el).trigger('change')
  },

  init: function(next) {
    this.setFrom(this.variableName)
    next()
  },

  observe: function() {
    var key = this.variableName
      , that = this
      , model = that.model
      , events = "input change"

    if((this.isInput || this.isContentEditable) && !this.isReadOnly) {
      this.clearUiEvent(events)
      this.uiEvent(events, function() {
        if(that.isContentEditable) {
          return model.set(key, that.el.html(), { validate: true })
        }
        if(that.el.attr("type") === "checkbox" && !that.el.prop("checked")) {
          return model.set(key, false, { validate: true })
        }
        if(that.el.attr("type") === "radio") {
          if(that.el.prop('checked')) {
            return model.set(key, that.el.val(), {validate: true})
          } else {
            return
          }
        }
        model.set(key, that.el.val(), { validate: true })
      })
    }

    this.change(key, function() {
      this.setFrom(key)
    }, this)
  }
}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.variable(el)
  },

  parse: function(el) {
    return {
      isReadOnly: el.is("[data-readonly]"),
      isInput: el.is(":input:not(button)"),
      isContentEditable: el.is("[contenteditable]"),
      variableName: rules.variable(el)
    }
  }
})

module.exports = VariableReaction
