var Backbone = require("backbone")
  , util = require("./util")
  , _ = require("underscore")
  , extend = Backbone.Model.extend
  , getPresenter

getPresenter = function(model) {
  return model
}

function Reaction(properties) {
  _.extend(this, properties)
}

Reaction.reactIf = function() {
  return true
}

Reaction.prototype.getPresenter = function(model) {
  return getPresenter(model)
}

Reaction.prototype.start = function(el, stack, next) {
  var that = this

  this.el = el
  this.stack = stack.slice(0)
  this.model = _.last(this.stack)
  this.presenter = getPresenter(this.model)

  this.init(function() {
    if((that.collection && typeof that.collection.on === "function") || typeof that.model.on === "function") { 
      that.observe(function() {
        next(that.stack, true)
      })
    }
    next(that.stack)
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

Reaction.prototype.init = function(next) {
  next()
}

Reaction.prototype.afterDOMConstruction = function(el, model, stack, template, next) {
  next(stack)
}

Reaction.parse = function() {}

Reaction.afterParse = function() {}

Reaction.setGetPresenter = function(getPresenterFn) {
  getPresenter = getPresenterFn
} 
 

Reaction.prototype.setupScope = function() {}
Reaction.prototype.observe = function() {}
Reaction.prototype.stopObserving = function() {}

_.extend(Reaction.prototype, Backbone.Events)
Reaction.extend = extend

module.exports = Reaction
