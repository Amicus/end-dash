var Backbone = require("backbone")
  , Template = require("./template")
  , path = require('path')
  , util = require("./util")
  , _ = require("underscore")
  , reactions = [];

var Parser = module.exports = function(markup, opts) {
  opts = opts || {}

  this.markup = $(markup)

  if (this.markup.length > 1) {
    throw new Error('multiple root elements in a template not currently supported - template: '+opts.templateName)
  }

  this.absolutePath = opts.templateName
  this.reactions = reactions
  this.structure = { children: [] }
  this.structureStack = [this.structure]

  this._state = {
    templates: opts.templates,
    pathStack: [this.absolutePath],
    currentDir: function() {
      return path.dirname(_.last(this.pathStack))
    }
  }

  this.preparse(this.markup)
  this.parse(this.markup)
}

_.extend(Parser.prototype, Backbone.Events)

Parser.registerReaction = function(reaction) {
  reactions.push(reaction)
}

Parser.prototype.traverse = function(el, callback) {
  var that = this
  el.each(function(i, el) {
    callback.call(that, $(el), function() {
      that.traverse($(el).children(), callback)
    })
  })
}

Parser.prototype.preparse = function(root) {
  this.traverse(root, function(el, next) {
    _(this.reactions).each(function(Reaction) {
      if(Reaction.preparse) {
        if(el.is(Reaction.selector) && Reaction.reactIf(el)) {
          Reaction.preparse(el, this._state)
        }
      }
    }, this)
    next()
    _(this.reactions).each(function(Reaction) {
      if(Reaction.afterPreparse) {
        if(el.is(Reaction.selector) && Reaction.reactIf(el)) {
          Reaction.afterPreparse(el, this._state)
        }
      }
    }, this)
  })
}

Parser.prototype.parse = function(root) {
  this.traverse(root, function(el, next) {
    var toClose = this.startReactions(el)
    next()
    for(var i = 0 ; i < toClose ; i++) {
      this.closeNode()
    }
  })
}

Parser.prototype.serialize = function() {
  return {
    structure: this.structure,
    markup: this.markup
  }
}

Parser.prototype.generate = function() {
  var Generated = Template.extend(this.serialize())
  return Generated
}

Parser.prototype.startReactions = function(el) {
  var toClose = 0
    , properties

  _(this.reactions).each(function(Reaction) {
    if(el.is(Reaction.selector) && Reaction.reactIf(el)) {
      properties = Reaction.startParse(el, this._state)
      this.openNode(el, Reaction, properties)
      toClose++
    }
  }, this)
  return toClose
}

Parser.prototype.openNode = function(el, Reaction, properties) {
  var structure = _(this.structureStack).last()

  structure.children.push({
    id: _.uniqueId("struct"),
    selector: util.getSelector(el, this.markup),
    Reaction: Reaction,
    properties: properties,
    children: []
  })
  this.structureStack.push(_(structure.children).last())
}

Parser.prototype.closeNode = function() {
  this.structureStack.pop()
}
