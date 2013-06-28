var Reaction = require("../reaction")
  , rules = require("../rules")
  , path = require("path")
  , Backbone = require("backbone")
  , _ = require("underscore")

var ModelReaction = Reaction.extend({

  init: function(next, reload) {
    var newModel = this.get(this.modelName)

    if(!(newModel instanceof Backbone.Model || newModel instanceof Backbone.Collection)) {
      newModel = new Backbone.Model(newModel || {})
    }

    this.el.data("model", newModel)
    this.stack.push(newModel)
    next(reload)
  },

  observe: function(next) {
    var that = this
    this.change(this.modelName, function(model) {
      this.init(next, true)
    }, this)
    if(this.el.is("form")) {
      this.el.on("submit", function(e) {
        that.model.save()
        e.preventDefault()
      })
    }
  }

}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.model(el)
  },

  parse: function(el, state) {
    return {
      modelName: rules.model(el),
      currentDirectory: state.currentDir()
    }
  }
})

module.exports = ModelReaction
