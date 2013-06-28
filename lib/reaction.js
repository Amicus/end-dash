var Backbone = require("backbone")
  , util = require("./util")
  , _ = require("underscore")
  , extend = Backbone.Model.extend
  , getPresenter

getPresenter = function(model) {
  return model
}

function Reaction(properties) {
  this.cid = _.uniqueId("Reaction")
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
    that.observe(function() {
      next(that.stack, true)
    })
    next(that.stack)
  })
}

Reaction.prototype.end = function() {}

Reaction.prototype.afterAll = function(next) {
  this.afterDOMConstruction(next)
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

Reaction.prototype.stopObserving = function() {
  this.el.off(".endDash" + this.cid)
  this.stopListening(this.presenter)
}

Reaction.parse = function() {}
Reaction.afterParse = function() {}

Reaction.setGetPresenter = function(getPresenterFn) {
  getPresenter = getPresenterFn
} 

Reaction.prototype.setupScope = function() {}
Reaction.prototype.observe = function() {}

_.extend(Reaction.prototype, Backbone.Events)
Reaction.extend = extend

module.exports = Reaction

