var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , _ = require("underscore")

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
