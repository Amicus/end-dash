var Backbone               = require("backbone")
  , inflection             = require("./inflection")
  , Parser                 = require("./parser")
  , util                   = require("./util")
  , path                   = require("path")
  , _                      = require("underscore")
  , inferClass

  , findDescendantsAndSelf = util.findDescendantsAndSelf
 
function Template(data, opts) {
  opts = opts || {}
  data = data || {}

  if(!this.markup) {
    throw new Error("Created template without markup")
  }
  this.template = this.markup.clone(true)
  this.bind(data)
}
 
Template.prototype.bind = function(data) {
  var presenter = data
    , that = this
    , model

  if(data.model) {
    model = data.model
  } else {
    model = data
  }
  if(this.model && this.model.off) {
    this.model.off(null, null, this)
  }
  var modelStack = [model]
  var afterDOMConstruction = []

  this.traverse(function(name, type, element, reaction) {
    //put model in this scope for closuring to work
    var currentModel = _(modelStack).last()
    if(type === "reaction") {
      if(reaction.setupScope) {
        reaction._previousStack = modelStack.slice(0)
        reaction.setupScope(element, currentModel, modelStack)
        currentModel = _(modelStack).last()
      }
      if(reaction.init) {
        reaction.init(element, currentModel, modelStack)
      } 
      if(reaction.afterDOMConstruction) {
        afterDOMConstruction.push(function() { reaction.afterDOMConstruction(element, currentModel, that) })
      }
    } else if(type === "afterReaction") {
      if(reaction._previousStack) {
        modelStack = reaction._previousStack
        currentModel = _(modelStack).last()
      }
    }
  })
  _(afterDOMConstruction).each(function(f) { f() })
}

Template.prototype.traverse = function(iterator) {
  _(this.structure).each(function(node) {
    var element
    if(node.selector) {
      element = findDescendantsAndSelf(this.template, node.selector)
    } else {
      element = this.template
    }
    iterator.call(this, node.key, node.type, element, node.reaction)
  }, this)
}

Template.extend = Backbone.Model.extend

module.exports = Template
