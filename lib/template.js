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
  this.traverse(this.structure, function(el, reaction, next) {
    reaction && reaction.start(el, this._state) 
    next()
    reaction && reaction.end(el, this._state) 
  })
  this.traverse(this.structure, function(el, reaction, next) {
    reaction && reaction.afterAll(el, this, this._state) 
    next()
    reaction && reaction.end(el, this._state) 
  })
}

Template.prototype.traverse = function(structure, callback) {
  var selector = structure.selector
    , properties = structure.properties
    , reaction = structure.Reaction && new structure.Reaction(properties)
    , el = this.getElement(selector) 
    , that = this

  callback.call(this, el, reaction, function() {
    _(structure.children).each(function(child) {
      that.traverse(child, callback)
    })
  })
}

Template.extend = Backbone.Model.extend

module.exports = Template
