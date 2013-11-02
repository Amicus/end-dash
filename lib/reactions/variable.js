var Reaction = require("../reaction")
  , _ = require("underscore")
  , util = require("../util")

var i = 0

var VariableReaction = Reaction.extend({

  init: function(next) {
    var that = this
    children = this.el[0].childNodes

    this.indexToNode = {}

    _(this.nodes).each(function(node) {
      this.indexToNode[node.index] = children[node.index]
    }, this)
    this.set()
    next()
  },

  set: function() {
    _(this.nodes).each(function(node) {
      var textNode = this.indexToNode[node.index]
      textNode.data = util.interpolate(node.data, this._presenter)
    }, this)
  },

  observe: function() {
    this.change(this.set, this)
  }
},
{
  selector: "*",

  reactIf: function(el) {
    el = el[0]
    var children = el.childNodes

    return _(children).any(function(child) {
      return child.nodeType === 3 && util.hasInterpolations(child.data)
    })
  },

  parse: function(el) {
    el = el[0]
    var nodes = []
      , children = el.childNodes

    _(children).each(function(child, index) {
      if(child.nodeType === 3 && util.hasInterpolations(child.data)) {
        nodes.push({ index: index, data: child.data })
      }
    })
    return { nodes: nodes }
  }
});

module.exports = VariableReaction;
