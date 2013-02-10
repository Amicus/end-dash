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
  this._state = {
    modelStack: [model],
    currentModel: function() {
      return _(this.modelStack).last()
    }
  }

  if(!this.markup) {
    throw new Error("Created template without markup")
  }
  this.template = this.markup.clone(true)
  this.bind()
}

Template.prototype.bind = function(iterator) {
  var afterAll = []
  _(this.structure).each(function(node) {
    var type = node.type
      , reaction = node.reaction
      , selector = node.selector
      , element = this.elementCache[selector] || findDescendantsAndSelf(this.template, selector)
      , model = this._state.currentModel()

    this.elementCache[selector] = element

    if(type === "start") {
      reaction.start(element, this._state)
      afterAll.push(function() { 
        reaction.afterAll(element, model, this)
      })
    } else if(type === "end") {
      reaction.end(element, this._state)
    } 
    
  }, this)
  _(afterAll).each(function(f) { f.call(this) }, this)
}

Template.extend = Backbone.Model.extend

module.exports = Template
