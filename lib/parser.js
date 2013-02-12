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
  this.structure = []
  this.allReactions = []

  this._state = {
    templates: templateRegistry,
    pathStack: [this.absolutePath],
    currentDir: function() {
      return path.dirname(_.last(this.pathStack))
    }
  }

  this.parse(this.markup)
  this.afterReactions()
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

Parser.prototype.parse = function(el) {
  var that = this

  if(!el.length) return

  do {
    var toClose = this.startReactions(el)
    this.parse(el.children().first())
    this.endReactions(el, toClose)
    el = el.next()
  } while(el.length)

}

Parser.prototype.afterReactions = function() {
  _(this.allReactions).each(function(map) {
    this.addStructure("afterAll", map.el, map.reaction)
  }, this)
}

Parser.prototype.generate = function() {
  var Generated = Template.extend({
    structure: this.structure,
    markup: this.markup
  })
  return Generated
}

Parser.prototype.startReactions = function(el) {
  var toClose = []

  _(this.reactions).each(function(Reaction) {
    var reaction = new Reaction()
    var selector = reaction.selector
    if(el.is(selector)) {
      if(reaction.reactIf(el)) {
        this.startReaction(el, reaction)
        toClose.push(reaction)
        this.allReactions.push({ reaction: reaction, el: el })
      }
    }
  }, this)
  return toClose
}

Parser.prototype.addStructure = function(type, el, reaction) {
  if(reaction.parseOnly) return
  this.structure.push({ 
    selector: util.getSelector(el, this.markup),
    reaction: reaction, 
    type: type
  }) 
}

Parser.prototype.startReaction = function(el, reaction) {
  reaction.startParse(el, this._state)
  this.addStructure("start", el, reaction)
}

Parser.prototype.endReactions = function(el, toClose) {
  _(_(toClose).reverse()).each(function(reaction) {
    this.endReaction(el, reaction)
  }, this)
}
   
Parser.prototype.endReaction = function(el, reaction) {
  reaction.endParse(el, this._state)
  this.addStructure("end", el, reaction)
}
