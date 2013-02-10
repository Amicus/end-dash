var Reaction = require("../reaction")
  , Parser = require("../parser")
  , inflection = require("../inflection")
  , _ = require("underscore")

function get(obj, key) {
  if(typeof obj.get === "function") {
    return obj.get(key)
  } else {
    return obj[key]
  }
}

var ModelReaction = Reaction.extend({
  selector: "*",

  reactIf: function(el) {
    return _(el.attr("class").split(/\s/)).any(function(className) {
      if(!className || !className.match(/-$/)) return
      //todo pull these is* methods into their own thing
      
      var isModel = Parser.prototype.isModel.call(Parser.prototype, className, el)
      if(isModel) {
        var modelName = this.state.modelName = className.slice(0, -1)
        if(!el.parent("." + inflection.pluralize(modelName) + "-").length) {
          return true
        }
      }
    }, this)
  },

  parse: function(el) {},

  init: function(el, model, modelStack) {
    modelStack.push(get(model, this.state.modelName))
  }
})

module.exports = ModelReaction 
