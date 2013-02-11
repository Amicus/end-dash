var inflection = require("./inflection")
  , Backbone = require("backbone")
  , Template = require("./template")
  , path = require("path")
  , util = require("./util")
  , _ = require("underscore")
  , reactions = {}
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

  this.parse()
  _(this.allReactions).each(function(obj) {
    var el = obj.el
      , reaction = obj.reaction
    this.structure.push({ 
      selector: util.getSelector(el, this.markup),
      reaction: reaction, 
      type: "afterAll" 
    })
  }, this)
}
_.extend(Parser.prototype, Backbone.Events)

Parser.registerReaction = function(reaction) {
  reactions[reaction.prototype.selector] = reactions[reaction.prototype.selector] || []
  reactions[reaction.prototype.selector].push(reaction)
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

Parser.prototype.parse = function(els) {
  var that = this

  if(!els) {
    els = this.markup
  }

  $(els).each(function(i, element) {
    that.parseElement($(element))
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
  var toClose = []

  _(this.reactions).each(function(reactions, selector) {
    if(el.is(selector)) {
      _(reactions).each(function(Reaction) {
        var reaction = new Reaction()
        if(reaction.reactIf(el)) {
          this.startReaction(el, reaction)
          toClose.push(reaction)
          this.allReactions.push({ reaction: reaction, el: el })
        }
      }, this)
    }
  }, this)
  return toClose
}

Parser.prototype.startReaction = function(el, reaction) {
  reaction.startParse(el, this._state)
  this.structure.push({ 
    selector: util.getSelector(el, this.markup),
    reaction: reaction, 
    type: "start" 
  })
}

Parser.prototype.endReactions = function(el, toClose) {
  _(toClose).each(function(reaction) {
    this.endReaction(el, reaction)
  }, this)
}
   
Parser.prototype.endReaction = function(el, reaction) {
  reaction.endParse(el, this._state)
  this.structure.push({ 
    reaction: reaction, 
    type: "end" 
  })
}

Parser.prototype.parseElement = function(el) {
  var toClose = this.startReactions(el)
  this.parse(el.children())
  this.endReactions(el, toClose)
}
