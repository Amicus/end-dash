var Backbone = require("backbone")
  , extend = Backbone.Model.extend
  , _ = require("underscore")

function Reaction() {
  this.state = {}
}

Reaction.prototype.reactIf = function() {
  return true
}

_.extend(Reaction.prototype, Backbone.Events)
Reaction.extend = extend

module.exports = Reaction
