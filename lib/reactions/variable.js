var Reaction = require("../reaction")
  , _ = require("underscore")
  , util = require("../util")

var VariableReaction = Reaction.extend({

  init: function(next) {
    var that = this
    children = this.el[0].childNodes
    _(this.nodes).each(function(node) {
      var textNode = node.textNode = children[node.index]
      textNode.data = util.interpolate(node.data, that._presenter)
    })
    next()
  },

  observe: function() {
    var that = this
    this.change(function() {
      _(that.nodes).each(function(node) {
        node.textNode.data = util.interpolate(node.data, that._presenter)
      })
    })
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
