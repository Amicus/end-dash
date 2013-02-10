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
  var afterAll = []
    , that = this
    , state = {
    modelStack: [model],
    currentModel: function() {
      return _(this.modelStack).last()
    }
  }
  this.traverse({
    reactionStart: function(reaction, element) {
      reaction.start(element, state)
      var model = state.currentModel()
      afterAll.push(function() { 
        reaction.afterAll(element, model, that)
      })
    },
    reactionEnd: function(reaction, element) {
      reaction.end(element, state)
    }
  })
  _(afterAll).each(function(f) { f.call(this) }, this)
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
