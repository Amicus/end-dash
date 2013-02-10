var inflection = require("./inflection")
  , Backbone = require("backbone")
  , _ = require("underscore")
  , path = require("path")
  , jqts = require("./util").jqts

var Parser = module.exports = function(markup, opts) {
  opts = opts || {}
  this.markup = markup
  this.templates = opts.templates
  this.rootTemplate = opts.rootTemplate
  this.reactions = opts.reactions || {}
}
_.extend(Parser.prototype, Backbone.Events)

Parser.prototype.parse = function(els) {
  var that = this

  if(!els) {
    els = this.markup
  }

  if(this.rootTemplate) {
    this.replacePartials(els, this.rootTemplate)
  }

  $(els).each(function(i, element) {
    that.parseElement($(element))
  })
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

Parser.prototype.parseReactions = function(el) {
  var that = this
    , toClose = []

  _(this.reactions).each(function(reactions, selector) {
    if(el.is(selector)) {
      _(reactions).each(function(Reaction) {
        reaction = new Reaction()
        if(reaction.reactIf(el)) {
          toClose.push(reaction)
          that.trigger("reaction", el, reaction)
        }
      })
    }
  })
  return toClose
}

Parser.prototype.afterReactions = function(el, toClose) {
  _(toClose).each(function(reaction) {
    this.trigger("afterReaction", el, reaction)
  }, this)
}

Parser.prototype.parseElement = function(el) {
  var toClose = this.parseReactions(el)
  this.parse(el.children())
  this.afterReactions(el, toClose)
}
