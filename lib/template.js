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
  this._getElement = this.getElement
  this.getElement = _.memoize(this._getElement)

  if(!this.markup) {
    throw new Error("Created template without markup")
  }

  var that = this
    , Parser = require("./parser")
  socket.on('update', function (data) {
    if(data.file.split(".")[0] == that.path) {
      var updated = (new Parser(data.contents, { templateName: "/test/hotswapping" })).value()
      that.hotSwap(updated.structure, updated.markup)
    }
  })

  this.template = this.markup.clone()
  this.bind()
}

Template.prototype.getElement = function(selector) {
  return findDescendantsAndSelf(this.template, selector)
}

Template.prototype.hotSwap = function(structure, markup) {
  var oldTemplate = this.template
  this.template = markup.clone()
  this.structure = structure
  /* TODO gc all these first */
  this.reactions = {}
  this.getElement = _.memoize(this._getElement)
  this.bind()
  oldTemplate.replaceWith(this.template)
}

Template.prototype.bind = function() {
  this.traverse(this.structure, this.stack, function(el, reaction, stack, next) {
    reaction.start(el, stack, next)
  })
}

Template.prototype.traverse = function(structure, stack, callback, reload) {
  var el = this.getElement(structure.selector) 
    , that = this
    , reaction

  function next(stack, doReload) {
    _(structure.children).each(function(child) {
      that.traverse(child, stack, callback, reload || doReload)
    })
  }
  if(!structure.Reaction) {
    return next(stack, reload)
  }

  if(reload) {
    delete this.reactions[structure.id]
  }

  reaction = (this.reactions[structure.id]) ? this.reactions[structure.id] : new structure.Reaction(structure.properties)
  this.reactions[structure.id] = reaction

  callback.call(this, el, reaction, stack, next)
}

Template.extend = Backbone.Model.extend

module.exports = Template
