var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , _ = require("underscore")

var AttributeReaction = Reaction.extend({
  selector: "*",

  reactIf: function(el) {
    var element = el[0]
      , attributes = element.attributes 

    if(element.hasAttributes()) {
      return _(attributes).any(function(attribute) {
        return attribute.value.match(/#\{/)
      })
    } else {
      return false
    }
  },

  init: function(el, model) {
    _(el[0].attributes).each(function(attribute) {
      attribute.value = attribute.value.replace(/#{(.+?)}/g, function(match, capture) {
        return get(model, capture)
      })
    })
  },

  observe: function(el, model) {
  }
})

module.exports = AttributeReaction
