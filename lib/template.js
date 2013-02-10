var Backbone               = require("backbone")
  , inflection             = require("./inflection")
  , Parser                 = require("./parser")
  , util                   = require("./util")
  , path                   = require("path")
  , _                      = require("underscore")

  , findDescendantsAndSelf = util.findDescendantsAndSelf
 
function Template(model, opts) {
  opts = opts || {}
  model = model || {}

  if(!this.markup) {
    throw new Error("Created template without markup")
  }
  this.template = this.markup.clone(true)
  this.bind(model)
}
 
Template.prototype.bind = function(model) {

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
        afterDOMConstruction.push(function() { reaction.afterDOMConstruction(element, currentModel, this) })
      }
    } else if(type === "afterReaction") {
      if(reaction._previousStack) {
        modelStack = reaction._previousStack
        currentModel = _(modelStack).last()
      }
    }
  })
  _(afterDOMConstruction).each(function(f) { f.call(this) }, this)
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
