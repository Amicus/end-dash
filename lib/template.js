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

  var presenter, model

  if(inferClass) {
    var presenterClass = inferClass("presenter", {})
    if(!data.model && typeof data.on === "function") {
      presenter = new presenterClass(data)
      model = data
    } else if(typeof data.on === "function") {
      presenter = data
      model = data.model
    } else {
      presenter = data
    }
  } else {
    presenter = data
  }

  this.collections = {}
  this.models = {}

  this.bind(presenter)
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

  this.traverse(function(name, type, element, options) {
    //put model in this scope for closuring to work
    var currentModel = _(modelStack).last()

    if(type == "conditional" || type === "attribute") {
      this._readFrom(name, presenter)
      if(element.is(":input:not(button), [contenteditable]")) {
        this._writeTo(element, name, model)
      }
    } else if(type === "reaction") {
      if(options.reaction.setupScope) {
        options.reaction.setupScope(element, currentModel, modelStack)
        currentModel = _(modelStack).last()
      }
      if(options.reaction.init) {
        options.reaction.init(element, currentModel, modelStack)
      } 
      if(options.reaction.afterDOMConstruction) {
        afterDOMConstruction.push(function() { options.reaction.afterDOMConstruction(element, currentModel, that) })
      }
    } else if(type === "afterReaction") {
      if(options.reaction.teardownScope) {
        options.reaction.teardownScope(element, currentModel, modelStack)
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
    iterator.call(this, node.key, node.type, element, node)
  }, this)
}

Template.extend = Backbone.Model.extend

module.exports = Template
