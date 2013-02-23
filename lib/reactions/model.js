var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , path = require("path")
  , Backbone = require("backbone")
  , _ = require("underscore")

var ModelReaction = Reaction.extend({

  init: function(el, model, stack, next, reload) {
    var newModel = get(model, this.modelName) || {}

    el.data("model", newModel)

    stack.push(newModel)
    next(stack, reload)
  },

  observe: function(el, model, stack, next) {
    var parentStack = stack.slice(0, -1)
      , parentModel = _.last(parentStack)
    if(typeof parentModel.on === "function") {
      parentModel.on("change:" + this.modelName, function(model) {
        this.init(el, model, parentStack, next, true)
      }, this)
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
  },


})

ModelReaction.getPresenter = function(model) {
  return model
}

ModelReaction.setGetPresenter = function(getPresenterFn) {
  ModelReaction.getPresenter = getPresenterFn
} 

module.exports = ModelReaction
