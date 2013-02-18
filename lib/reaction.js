var Backbone = require("backbone")
  , util = require("./util")
  , _ = require("underscore")
  , extend = Backbone.Model.extend

function Reaction() {
  this.state = {}
}

Reaction.prototype.reactIf = function() {
  return true
}

Reaction.prototype.start = function(el, state) {

  this._previousStack = state.modelStack.slice(0)
  this.setupScope(el, state.currentModel(), state)

  this._model = state.currentModel()
  this.init(el, state.currentModel(), state)

  if(typeof state.currentModel().on === "function") { 
    this.observe(el, state.currentModel(), state)
  }
}

Reaction.prototype.end = function(el, state) {
  if(this._previousStack) 
    state.modelStack = this._previousStack
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
  this.afterParse(el, state)
}

Reaction.prototype.parse = function() {}
Reaction.prototype.afterParse = function() {}
Reaction.prototype.setupScope = function() {}
Reaction.prototype.init = function() {}
Reaction.prototype.observe = function() {}
Reaction.prototype.afterDOMConstruction = function() {}

_.extend(Reaction.prototype, Backbone.Events)
Reaction.extend = extend

module.exports = Reaction
