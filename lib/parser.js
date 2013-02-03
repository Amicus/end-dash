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

Parser.prototype.parseReactions = function(el) {
  var that = this
  _(this.reactions).each(function(events, selector) {
    if(el.is(selector)) {
      _(events).each(function(eventHandlers) {
        eventHandlers.parse(el)
        that.trigger("reaction", el, eventHandlers)
      })
    }
  })
}

Parser.prototype.parseElement = function(el) {
  var children = el.children() //hold on to these right away, just in case we remove them from the parent in the parse process

  this.parseReactions(el)
  if(el.attr("class")) {
    var classes = el.attr("class").split(/\s+/)
      , match

    var open = []

    var newScope = false
      , scopeType = ""
      , noDash = ""
      , polymorphicKey
      , polymorphicValue
      , p = null //placeholder

    classes = _(classes).reject(function(className) {
      if(match = className.match(/(.+)-$/)) {
        if(p = this.isPolymorphicKey(className, el)) {
          if(polymorphicKey) {
            throw new Error("The element with classes " + classes + " defines multiple polymorphic keys")
          }
          polymorphicKey = p
          return true
        } else if(p = this.isPolymorphicValue(className, el)) {
          if(polymorphicValue) {
            throw new Error("The element with classes " + classes + " defines multiple polymorphic values")
          }
          polymorphicValue = p
          return true
        } else if(this.isCollection(className, el)) { //whether or not we're opening a scope
            if(newScope) {
              throw new Error("The element with classes " + classes + " defines multiple scopes")
            }

            noDash = match[1]
            newScope = true
            scopeType = "collection"
            return true

        } else if(this.isModel(className, el)) {
          if(newScope) {
            throw new Error("The element with classes " + className + " defines multiple scopes")
          }

          noDash = match[1]
          newScope = true
          scopeType = "model"
          return true
        }
      }
    }, this)

    // create new scope
    if ( newScope ) {
      open.push(noDash)
      if(scopeType == "model") {
        this.trigger(scopeType, noDash, el, polymorphicValue)
      }
      if(scopeType == "collection") {
        this.trigger(scopeType, noDash, el, polymorphicKey)
      }
    }

    _(classes).each(function(className) {
      if(match = className.match(/(.+)-$/)) {
        var noDash = match[1]
          , conditionalName
        //whether or not we're opening a scope
        if(this.isView(className, el)) {
          this.trigger("view", noDash, el)
        } else if(conditionalName = this.isConditional(className, el)) {
          //isConditional returns the name
          this.trigger("conditional", conditionalName, el)
        } else {
          //this type of variable replaces the innerHTML of el with it's contents
          this.trigger("variable", noDash, el, "innerHTML")
        }
      }
    }, this)
  }

  if(el[0].hasAttributes()) {
    _.each(el[0].attributes, function(attr) {
      var name = attr.name
        , value = attr.value

      if(variables = value.match(/#\{(.*?)\}/g)) {
        _(variables).each(function(variable) {
          variable = variable.slice(2, -1)
          this.trigger("variable", variable, el, name, value)
        }, this)
      }
    }, this)
  }
  this.parse(children)
  _(open).each(function(name) {
    this.trigger("close", name)
  }, this)
}
