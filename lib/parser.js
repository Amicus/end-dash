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
  this.templates = templateRegistry
  this.absolutePath = opts.templateName
  this.reactions = reactions
  this.structure = []
  this.allReactions = []

  this.parse()
}
_.extend(Parser.prototype, Backbone.Events)

Parser.registerReaction = function(reaction) {
  reactions[reaction.prototype.selector] = reactions[reaction.prototype.selector] || []
  reactions[reaction.prototype.selector].push(reaction)
}

var CollectionReaction = require("./reactions/collection")
var ModelReaction = require("./reactions/model")
var VariableReaction = require("./reactions/variable")

Parser.registerReaction(CollectionReaction)
Parser.registerReaction(ModelReaction)
Parser.registerReaction(VariableReaction)
 

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

  if(this.absolutePath) {
    this.replacePartials(els, this.absolutePath)
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

Parser.prototype.replacePartials = function(context, currentTemplate) {
  this.replaceEmbeddedPartials(context, currentTemplate)
  this.replaceContentPartials(context, currentTemplate)
}

Parser.prototype.replaceContentPartials = function(context, currentTemplate) {
  var contentSelector = "div[src], li[src], span[src]"
    , contentPartials = context.find(contentSelector).add(context.filter(contentSelector))
    , that = this


  contentPartials.each(function(i, el) {
    var element = $(el)
      , src = element.attr("src")

    if(!src) return
    var file = path.resolve(path.dirname(currentTemplate), src)
      , template = $(that.templates[file])

    //recursively replace partials inside of partials
    that.replacePartials(template, file)

    element.html(template)
  })
}

Parser.prototype.replaceEmbeddedPartials = function(context, currentTemplate) {
  var embedSelector = "[src][type=text\\/x-end-dash]"
    , embedPartials = context.find(embedSelector).add(context.filter(embedSelector))
    , that = this

  embedPartials.each(function(i, el) {
    var element = $(el)
      , src = element.attr("src")
    if(!src) return

    var file = path.resolve(path.dirname(currentTemplate), src)
      , template = $(that.templates[file])

    //recursively replace partials inside of partials
    that.replacePartials(template, file)

    element.replaceWith(template)
  })
}

Parser.prototype.isModel = function(className, el) {
   return el[0].tagName.toLowerCase() !== "select" &&
          !this.isView(className, el) &&
          !this.isConditional(className, el) &&
          !this.isCollection(className, el) &&
          (el.parent().is("." + inflection.pluralize(className.slice(0, -1)) + "-") ||
          el.children().length > 0)
}

Parser.prototype.isPolymorphicKey = function(className, el) {
  var match = className.match(/(.*)Polymorphic-/)
  if(match && match[1]) {
    return match[1]
  }
  return false
}

Parser.prototype.isPolymorphicValue = function(className, el) {
  var match = className.match(/when(.*)-/)
  if(match && match[1]) {
    return match[1][0].toLowerCase() + match[1].slice(1)
  }
  return false
}
/**
 * returns whether className on element refers to a collection
 **/
Parser.prototype.isCollection = function(className, el) {
  var name = inflection.singularize(className.slice(0, -1))
  return el.children("." + name + "-").length > 0 &&
         !this.isView(className, el) &&
         !this.isConditional(className, el)
}

Parser.prototype.isView = function(className, el) {
  return !!className.match(/View-$/)
}

Parser.prototype.isConditional = function(className, el) {
  var name = className.match(/is(.+)-/)
  if(name) {
    return name[1].charAt(0).toLowerCase() + name[1].slice(1)
  } else {
    return false
  }
}
var i = 0

Parser.prototype.startReactions = function(el) {
  var toClose = []

  _(this.reactions).each(function(reactions, selector) {
    if(el.is(selector)) {
      _(reactions).each(function(Reaction) {
        var reaction = new Reaction()
        if(reaction.reactIf(el)) {
          this.startReaction(el, reaction)
          toClose.push(reaction)
          this.allReactions.push(reaction)
        }
      }, this)
    }
  }, this)
  return toClose
}

Parser.prototype.startReaction = function(el, reaction) {
  if(reaction.parse) {
    reaction.parse(el)
  }
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
