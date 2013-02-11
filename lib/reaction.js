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

  this._model = state.currentModel()
  this.init(el, this._model)

  if(typeof state.currentModel().on === "function") { 
    this.observe(el, this._model)
  }
}

Reaction.prototype.end = function(el, state) {
  if(this._previousStack) {
    state.modelStack = this._previousStack
  }
}

Reaction.prototype.afterAll = function(el, template) {
  this.afterDOMConstruction(el, this._model, template)
}

Reaction.prototype.startParse = function(el, state) {
  this._previousPaths = state.pathStack.slice(0)
  this.parse(el, state)
}

Reaction.prototype.endParse = function(el, state) {
  state.pathStack = this._previousPaths
}

Reaction.prototype.parse = function() {}
Reaction.prototype.setupScope = function() {}
Reaction.prototype.init = function() {}
Reaction.prototype.observe = function() {}
Reaction.prototype.afterDOMConstruction = function() {}

_.extend(Reaction.prototype, Backbone.Events)
Reaction.extend = extend

module.exports = Reaction
