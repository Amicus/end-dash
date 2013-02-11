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

  parse: function(el) {
    this.state.attributes = _.chain(el[0].attributes).map(function(attribute) {
      return [attribute.name, attribute.value]
    }).object().value()
  },

  init: function(el, model) {
    _(this.state.attributes).each(function(value, key) {
      el.attr(key, value.replace(/#{(.+?)}/g, function(match, capture) {
        return get(model, capture)
      }))
    })
  },

  observe: function(el, model) {
    model.on("change", function(model, options) {
      this.init(el, model)
    }, this)
  }
})

module.exports = AttributeReaction
