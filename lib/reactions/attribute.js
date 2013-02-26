var Reaction = require("../reaction")
  , util = require("../util")
  , rules = require("../rules")
  , _ = require("underscore")
  , get = util.get
  , trim = util.trim
  , interpolatorRegex = /#\{([a-zA-Z0-9_\- ]+)(?:\?([a-zA-Z0-9_\- ]+))?(?:\:([a-zA-Z0-9_\- ]*))?}/g

var AttributeReaction = Reaction.extend({

  init: function(next) {
    this.updateAttributes(this.attributes)
    next()
  },
 
  updateAttributes: function(attributes) {
    var that = this
    _(attributes).each(function(value, key) {
      that.el.attr(key, value.replace(interpolatorRegex, function(match, key, valueIfTrue, valueIfFalse) {
        var value = get(that.presenter, key = trim(key))

        valueIfTrue = trim(valueIfTrue) || value
        valueIfFalse = (typeof valueIfFalse == "undefined") ? "": trim(valueIfFalse)

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
  observe: function() {
    if(this.presenter.on) {
      this.presenter.on("change", function() {
        this.updateAttributes(this.attributes)
      }, this)
    }
  } 

}, {
  selector: "*",

  reactIf: function(el) {
    return _(el[0].attributes || []).any(function(attribute) {
      return attribute.value.match(/#\{/)
    }, this) 
  },
 
  parse: function(el) {
    var attributes = {}
    _(el[0].attributes || []).each(function(attribute) {
      if(attribute.value.match(/#\{/)) {
        attributes[attribute.name] = attribute.value
      }
    }, this)
    return { attributes: attributes }
  }
})

module.exports = AttributeReaction
