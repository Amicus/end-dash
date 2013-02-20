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

Reaction.prototype.start = function(el, stack, next) {
  var that = this
  stack = stack.slice(0)

  this.init(el, _.last(stack), stack, function(stack) {
    that.stack = stack
    if(typeof _.last(stack).on === "function") { 
      that.observe(el, _.last(stack), stack, next)
    }
    next(stack)
  })
}

Reaction.prototype.end = function() {}

Reaction.prototype.afterAll = function(el, stack, template, next) {
  this.afterDOMConstruction(el, _.last(this.stack), this.stack, template, next)
}

Reaction.startParse = function(el, state) {
  this._previousPaths = state.pathStack.slice(0)
  return this.parse(el, state)
}

Reaction.endParse = function(el, state) {
  state.pathStack = this._previousPaths
  this.afterParse(el, state)
}

Reaction.prototype.init = function(el, model, stack, next) {
  next(stack)
}

Reaction.prototype.afterDOMConstruction = function(el, model, stack, template, next) {
  next(stack)
}

Reaction.parse = function() {}
Reaction.afterParse = function() {}

Reaction.prototype.setupScope = function() {}
Reaction.prototype.observe = function() {}
Reaction.prototype.stopObserving = function() {}

_.extend(Reaction.prototype, Backbone.Events)
Reaction.extend = extend

module.exports = Reaction
