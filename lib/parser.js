var Backbone = require("backbone")
  , Template = require("./template")
  , path = require("path")
  , util = require("./util")
  , _ = require("underscore")
  , reactions = []
  , templateRegistry = {}
  , templateClassRegistry = {}

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

Parser.prototype.traverse = function(el, callbacks, isChild) {
  var next
  while(el && el.length) {
    callbacks.open.call(this, el)
    this.traverse(el.children().first(), callbacks, true)
    next = el.next()
    callbacks.close.call(this, el)
    el = (isChild) ? next : false
  }
}

Parser.prototype.preparse = function(root) {
  this.traverse(root, {
    open: function(el) {
      _(this.reactions).each(function(Reaction) {
        if(Reaction.preparse) {
          if(el.is(Reaction.prototype.selector)) {
            Reaction.preparse(el, this._state)
          }
        }
      }, this)
    },
    close: function(el) {
      _(this.reactions).each(function(Reaction) {
        if(Reaction.afterPreparse) {
          if(el.is(Reaction.prototype.selector)) {
            Reaction.afterPreparse(el, this._state)
          }
        } 
      }, this)
    }
  })
}
 
Parser.prototype.parse = function(root) {
  var toClose = []
  this.traverse(root, {
    open: function(el) {
      toClose.push(this.startReactions(el))
    }, 

    close: function() {
      var count = toClose.pop()
        , i

      for(i = 0 ; i < count ; i++) {
        this.closeNode()
      }
    }
  })
}

Parser.prototype.generate = function() {
  var Generated = Template.extend({
    structure: this.structure,
    markup: this.markup
  })
  return Generated
}

Parser.prototype.startReactions = function(el) {
  var toClose = 0
  _(this.reactions).each(function(Reaction) {
    if(el.is(Reaction.prototype.selector)) {
      var reaction = new Reaction()
      if(reaction.reactIf(el)) {
        this.startReaction(el, reaction)
        toClose++
      }
    }
  }, this)
  return toClose
}

Parser.prototype.openNode = function(el, reaction) {
  var structure = _(this.structureStack).last() 

  structure.children.push({
    selector: util.getSelector(el, this.markup),
    reaction: reaction, 
    children: []
  }) 
  this.structureStack.push(_(structure.children).last())
}

Parser.prototype.closeNode = function() {
  this.structureStack.pop()
}

Parser.prototype.startReaction = function(el, reaction) {
  reaction.startParse(el, this._state)
  this.openNode(el, reaction)
}
