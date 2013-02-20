var Backbone = require("backbone")
  , util = require("./util")
  , _ = require("underscore")
  , extend = Backbone.Model.extend

function Reaction(properties) {
  _.extend(this, properties)
}

Reaction.reactIf = function() {
  return true
}

Reaction.prototype.start = function(el, state) {
  this._previousStack = state.modelStack.slice(0)
  this.setupScope(el, state.currentModel(), state)

  this.init(el, state.currentModel(), state)

  if(typeof state.currentModel().on === "function") { 
    this.observe(el, state.currentModel(), state)
  }
}

Reaction.prototype.end = function(el, state) {
  state.modelStack = this._previousStack
}

Reaction.prototype.afterAll = function(el, template, state) {
  this._previousStack = state.modelStack.slice(0)
  this.setupScope(el, state.currentModel(), state)
  this.afterDOMConstruction(el, state.currentModel(), template)
}

Reaction.startParse = function(el, state) {
  this._previousPaths = state.pathStack.slice(0)
  return this.parse(el, state)
}

Reaction.endParse = function(el, state) {
  state.pathStack = this._previousPaths
  this.afterParse(el, state)
}
Reaction.parse = function() {}
Reaction.afterParse = function() {}

Reaction.prototype.setupScope = function() {}
Reaction.prototype.init = function() {}
Reaction.prototype.observe = function() {}
Reaction.prototype.afterDOMConstruction = function() {}

_.extend(Reaction.prototype, Backbone.Events)
Reaction.extend = extend

module.exports = Reaction
