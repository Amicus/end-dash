var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , _ = require("underscore")

var AttributeReaction = Reaction.extend({
  selector: "*",

  reactIf: function(el) {
    if(!el[0].hasAttributes()) {
      return
    }

    var attributes = _(el[0].attributes).chain()
    .map(function(attribute) {
      if(attribute.value.match(/#\{/)) {
        return [attribute.name, attribute.value]
      }
    })
    .filter(function(x) { return x }).value()

    if(attributes.length) {
      return this.state.attributes = _.object(attributes)
    }
  },

  init: function(el, model) {
    this.updateAttributes(el, model, this.state.attributes)
  },
 
  updateAttributes: function(el, model, attributes) {
    _(attributes).each(function(value, key) {
      el.attr(key, value.replace(/#{(.+?)}/g, function(match, capture) {
        return get(model, capture)
      }))
    }) 
  },

  observe: function(el, model) {
    model.on("change", function() {
      this.updateAttributes(el, model, this.state.attributes)
    }, this)
  } 

})

module.exports = AttributeReaction
