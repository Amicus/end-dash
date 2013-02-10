var Backbone = require("backbone")
var extend = Backbone.Model.extend

function Reaction() {
  this.state = {}
}

Reaction.prototype.reactIf = function() {
  return true
}

Reaction.extend = extend

module.exports = Reaction
