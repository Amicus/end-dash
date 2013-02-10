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
  this.elementCache = {}

  if(!this.markup) {
    throw new Error("Created template without markup")
  }
  this.template = this.markup.clone(true)
  this.bind(model)
}
 
Template.prototype.bind = function(model) {

  var modelStack = [model]
  var afterDOMConstruction = []
  this.traverse({
    reactionStart: function(reaction, element) {
      var currentModel = _(modelStack).last()

      if(reaction.setupScope) {
        reaction._previousStack = modelStack.slice(0)
        reaction.setupScope(element, currentModel, modelStack)
        currentModel = _(modelStack).last()
      }
      if(reaction.init) {
        reaction.init(element, currentModel, modelStack)
      } 
      if(reaction.observe && typeof currentModel.on === "function") {
        reaction.observe(element, currentModel, modelStack)
      } 
      if(reaction.afterDOMConstruction) {
        afterDOMConstruction.push(function() { 
          reaction.afterDOMConstruction(element, currentModel, this) 
        })
      }
    },

    reactionEnd: function(reaction, element) {
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
    var type = node.type
      , reaction = node.reaction
      , selector = node.selector
      , element = this.elementCache[selector] || findDescendantsAndSelf(this.template, selector)

    this.elementCache[selector] = element

    if(type === "start") {
      iterator.reactionStart.call(this, reaction, element)
    } else if(type === "end") {
      iterator.reactionEnd.call(this, reaction, element)
    } 
  }, this)
}

Template.extend = Backbone.Model.extend

module.exports = Template
