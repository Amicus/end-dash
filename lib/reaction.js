var Backbone = require("backbone")
var extend = Backbone.Model.extend

function Reaction() {
  this.state = {}
}
Reaction.extend = extend

module.exports = Reaction
