var Backbone               = require("backbone")
  , util                   = require("./util")
  , path                   = require("path")
  , _                      = require("underscore")
  , findDescendantsAndSelf = util.findDescendantsAndSelf
 
function Template(model, opts) {
  var stack

  opts = opts || {}
  this.model = model = model || {}
  this.stack = opts.stack || []

  this.stack.push(model)

  this.reactions = {}
  this.getElement = _.memoize(this.getElement)

  if(!this.markup) {
    throw new Error("Created template without markup")
  }
  this.template = this.markup.clone()
  this.bind()
}

Template.prototype.getElement = function(selector) {
  return findDescendantsAndSelf(this.template, selector)
}

Template.prototype.bind = function() {
  this.traverse(this.structure, this.stack, function(el, reaction, stack, next) {
    reaction.start(el, stack, next)
  })
}

function mapTraverse(structure, iterator, ctx) {
  structure.children = _(structure.children).map(function(child, i) {
    return mapTraverse(child, iterator, ctx)
  }, ctx)
  return iterator.call(ctx, structure)
}

Template.prototype.freeze = function() {
  var structure = mapTraverse(this.structure, function(structure) {
    var frozen = {
      children: structure.children,
      id: structure.id
    }
    if(structure.Reaction) {
      frozen.properties = structure.properties
      frozen.name = structure.Reaction.prototype.name
    }
    if(structure.selector != null) {
      frozen.selector = structure.selector
    }
    return frozen
  }, this)

  return {
    markup: $("<div />").html(this.template.clone()).html(),
    model: this.model.toJSON(),
    structure: structure
  }
}

Template.thaw = function(frozen) {
  var reactions = {}
  var structure = mapTraverse(frozen.structure, function(node) {
    if(node.name) {
      node.Reaction = require("./reactions/" + node.name)
    }
    return node
  })

  var Thawed = Template.extend({
    markup: $(frozen.markup),
    structure: structure
  })

  var model = new Backbone.Model(structure.model)

  return { 
    template: new Thawed(model),
    model: model
  }
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
