var Backbone = require("backbone")
  , extend = Backbone.Model.extend
  , _ = require("underscore")

function Reaction() {
  this.state = {}
}

Reaction.prototype.reactIf = function() {
  return true
}

Reaction.prototype.start = function(el, state) {
  this._previousStack = state.modelStack.slice(0)
  this.setupScope(el, state.currentModel(), state.modelStack)

  this.init(el, state.currentModel(), state.modelStack)

  if(typeof state.currentModel().on === "function") { 
    this.observe(el, state.currentModel(), state.modelStack)
  }
}

Reaction.prototype.afterAll = function(el, model, template) {
  this.afterDOMConstruction(el, model, template)
}

Reaction.prototype.end = function(el, state) {
  if(this._previousStack) {
    state.modelStack = this._previousStack
  }
}

Reaction.prototype.setupScope = function() {}
Reaction.prototype.init = function() {}
Reaction.prototype.observe = function() {}
Reaction.prototype.afterDOMConstruction = function() {}

_.extend(Reaction.prototype, Backbone.Events)
Reaction.extend = extend

module.exports = Reaction
