var Reaction = require("../reaction")
  , util = require("../util")
  , rules = require("../rules")
  , _ = require("underscore")
  , get = util.get
  , trim = util.trim
  , interpolatorRegex = /#\{([a-zA-Z_\- ]+)(?:\?([a-zA-Z_\- ]+))?(?:\:([a-zA-Z_\- ]*))?}/g

var AttributeReaction = Reaction.extend({
  selector: "*",

  reactIf: function(el) {
    this.state.attributes = {}
    _(el[0].attributes || []).each(function(attribute) {
      if(attribute.value.match(/#\{/))
        this.state.attributes[attribute.name] = attribute.value
    }, this)
    return _.keys(this.state.attributes).length
  },

  init: function(el, model) {
    this.updateAttributes(el, model, this.state.attributes)
  },
 
  updateAttributes: function(el, model, attributes) {
    _(attributes).each(function(value, key) {
      el.attr(key, value.replace(interpolatorRegex, function(match, key, valueIfTrue, valueIfFalse) {
        var value = get(model, key = trim(key))

        valueIfTrue = trim(valueIfTrue) || value
        valueIfFalse = trim(valueIfFalse) || ""
 
        /**
         * use the name of the variable if it's a boolean true, for convienient 
         * class toggling
         **/ 
        if(valueIfTrue === true) {
          valueIfTrue = key
        }

        return value ? valueIfTrue : valueIfFalse
      }))
    }) 
  },
  /** 
   * TODO, ensure we never set blank src attributes 
   **/
  observe: function(el, model) {
    model.on("change", function() {
      this.updateAttributes(el, model, this.state.attributes)
    }, this)
  } 

})

module.exports = AttributeReaction