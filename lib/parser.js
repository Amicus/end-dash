var Backbone = require("backbone")
  , Template = require("./template")
  , util = require("./util")
  , path = require("path")
  , _ = require("underscore")
  , reactions = []
  , templateClassRegistry = {}
  , templateRegistry = {}

var Parser = module.exports = function(markup, opts) {
  opts = opts || {}

  this.markup = $(markup)
  this.absolutePath = opts.templateName
  this.reactions = reactions
  this.structure = { children: [] }
  this.structureStack = [this.structure]

  this._state = {
    templates: templateRegistry,
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
 
Parser.registerTemplate = function(name, View) {
  name = path.normalize(name)
  templateRegistry[name] = View
}
  
Parser.getTemplate = function(name) {
  var rawHtml
  name = path.normalize(name)

  if(templateClassRegistry[name]) {
    return templateClassRegistry[name]
  } else {
    rawHtml = templateRegistry[name]
    if(!rawHtml) {
      throw new Error("Could not find template: " + name)
    }
    return templateClassRegistry[name] = (new Parser(rawHtml, { templateName: name })).generate()
  }
}

Parser.prototype.traverse = function(el, callback) {
  var that = this
  el.each(function(i, el) {
    var next
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

Parser.prototype.value = function() {
  return {
    structure: this.structure,
    markup: this.markup
  }
}

Parser.prototype.generate = function() {
  var Generated = Template.extend(this.value())
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
