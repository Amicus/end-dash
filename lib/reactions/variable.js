var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , ModelReaction = require("./model")

var VariableReaction = Reaction.extend({

  setFrom: function(key) {
    var newVal = this.get(key)
      , oldVal

    if(this.isInput) {
      oldVal = this.el.val()
      if(this.el.attr("type") === "checkbox") {
        $(this.el).prop("checked", !!newVal)
      } else if(this.el.attr("type") === "radio") {
        if(oldVal == newVal) {
          $(this.el).prop("checked", true)
        } else {
          $(this.el).prop("checked", false)
        }
      } else if(newVal !== oldVal) {
        $(this.el).val(newVal)
      }
    } else {
      oldVal = $(this.el).html()
      if(oldVal !== newVal) {
        $(this.el).html(newVal)
      }
    }
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
          return model.set(key, that.el.html())
        }
        if(that.el.attr("type") === "checkbox" && !that.el.prop("checked")) {
          return model.set(key, false)
        }
        model.set(key, that.el.val())
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
