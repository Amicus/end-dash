var Backbone               = require("backbone")
  , util                   = require("./util")
  , path                   = require("path")
  , _                      = require("underscore")
  , findDescendantsAndSelf = util.findDescendantsAndSelf
 
function Template(model, opts) {
  var stack

  opts = opts || {}
  model = model || {}
  this.stack = opts.stack || []

  this.stack.push(model)

  this.reactions = {}
  this.resetState()
  this.getElement = _.memoize(this.getElement)

  if(!this.markup) {
    throw new Error("Created template without markup")
  }
  this.template = this.markup.clone()
  this.bind()
}

Template.prototype.resetState = function() {
  this._state = {
    modelStack: this.stack.slice(0),
    currentModel: function() {
      return _(this.modelStack).last()
    }
  }
}

Template.prototype.getElement = function(selector) {
  return findDescendantsAndSelf(this.template, selector)
}

Template.prototype.bind = function() {
  this.traverse(this.structure, this.stack, function(el, reaction, stack, next) {
    reaction.start(el, stack, next)
  })
  this.traverse(this.structure, this.stack, function(el, reaction, stack, next) {
    reaction.afterAll(el, stack, this, next)
  })
}

Template.prototype.traverse = function(structure, stack, callback, reload) {
  var el = this.getElement(structure.selector) 
    , that = this

  if(reload && structure.reaction) {
    structure.reaction.stopObserving()
    delete structure.reaction
  }
  if(!structure.reaction)
    structure.reaction = structure.Reaction && new structure.Reaction(structure.properties)

  function next(stack, doReload) {
    _(structure.children).each(function(child) {
      that.traverse(child, stack, callback, reload || doReload)
    })
  }
  if(structure.reaction) 
    callback.call(this, el, structure.reaction, stack, next)
  else
    next(stack, reload)
}

Template.extend = Backbone.Model.extend

module.exports = Template
