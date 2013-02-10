var _                      = require("underscore")
  , inflection             = require("./inflection")
  , Parser                 = require("./parser")
  , util                   = require("./util")
  , findDescendantsAndSelf = util.findDescendantsAndSelf
  , path                   = require("path")
  , reactions = {}

/**
 * A Factory that, given markup, can generate template constructors.  The
 * markup is parsed and the results of the parsed markup are given to the
 * generated Template function as it's prototype.
 **/
function TemplateFactory(markup, opts) {
  opts = opts || {}
  //wrap it in a div so that we always have a root element
  this.markup = $(markup)
  /* This is the absolute path to the template, used for including relative partials */
  this.name = opts.templateName

  this.templateProto = { 
    subTemplateFactories: {},
    collectionFactories: {}, 
    models: {}, 
    keys: {}, 
    fileName: this.name
  }

  this.templateProto.structure = []

  //parse unless the user didn't EXPLICITLY tell the factory not to parse the markup
  if(opts.parse !== false)
    this.parse()
}

module.exports = TemplateFactory

var inferClass

TemplateFactory.setClassInferer = function(inferer) {
  inferClass = inferer
}

var templateRegistry = {}
var templateClassRegistry = {}

TemplateFactory.registerTemplate = function(name, View) {
  name = path.normalize(name)
  templateRegistry[name] = View
}

TemplateFactory.getTemplate = function(name) {
  var rawHtml

  name = path.normalize(name)

  if(templateClassRegistry[name]) {
    return templateClassRegistry[name]
  } else {
    rawHtml = templateRegistry[name]
    if(!rawHtml) {
      throw new Error("Could not find template: " + name)
    }
    return templateClassRegistry[name] = (new TemplateFactory(rawHtml, { templateName: name })).generate()
  }
}

TemplateFactory.registerReaction = function(reaction) {
  reactions[reaction.prototype.selector] = reactions[reaction.prototype.selector] || []
  reactions[reaction.prototype.selector].push(reaction)
}

var CollectionReaction = require("./reactions/collection")
var ModelReaction = require("./reactions/model")
var VariableReaction = require("./reactions/variable")

TemplateFactory.registerReaction(CollectionReaction)
TemplateFactory.registerReaction(ModelReaction)
TemplateFactory.registerReaction(VariableReaction)

/**
 *
 **/

TemplateFactory.prototype.mapReaction = function(el, reaction) {
  if(reaction.parse) {
    reaction.parse(el)
  }
  var selector = util.getSelector(el, this.markup)
  this.templateProto.structure.push({ selector: selector, reaction: reaction, type: "reaction" })
}
 
TemplateFactory.prototype.mapAfterReaction = function(el, reaction) {
  var selector = util.getSelector(el, this.markup)
  this.templateProto.structure.push({ selector: selector, reaction: reaction, type: "afterReaction" })
}

/** 
 * Listens to events on parser and maps the elements found.
 **/
TemplateFactory.prototype.parse = function() {
  var that = this
  this.parser = new Parser(this.markup, { templates: templateRegistry, rootTemplate: this.name, reactions: reactions })
  this.parser.on("reaction", function(el, reaction) {
    that.mapReaction(el, reaction)
  })

  this.parser.on("afterReaction", function(el, reaction) {
    that.mapAfterReaction(el, reaction)
  })

  this.parser.parse()
}

var TemplateMethods = {}

TemplateFactory.prototype.generate = function() {
  var that = this

  function Template(data, opts) {
    opts = opts || {}
    data = data || {}
    //only take the inner html to "unwrap" the containing div from above
    this.template = that.markup.clone(true)
    this.container = opts.container
    if(this.container) {
      this.container.html(this.template)
    }

    var presenter, model

    if(inferClass) {
      var presenterClass = inferClass("presenter", {})
      if(!data.model && typeof data.on === "function") {
        presenter = new presenterClass(data)
        model = data
      } else if(typeof data.on === "function") {
        presenter = data
        model = data.model
      } else {
        presenter = data
      }
    } else {
      presenter = data
    }

    this.collections = {}
    this.models = {}

    this.bind(presenter)
  }

  Template.prototype = _.extend({}, this.templateProto, TemplateMethods)
  return Template
}

TemplateMethods.bind = function(data) {
  var presenter = data
    , that = this
    , model

  if(data.model) {
    model = data.model
  } else {
    model = data
  }
  if(this.container) {
    this.container.data("model", model)
    this.container.data("presenter", presenter)
  }
  if(this.model && this.model.off) {
    this.model.off(null, null, this)
  }
  var modelStack = [model]
  var afterDOMConstruction = []

  this.traverse(function(name, type, element, options) {
    //put model in this scope for closuring to work
    var currentModel = _(modelStack).last()

    if(type == "conditional" || type === "attribute") {
      this._readFrom(name, presenter)
      if(element.is(":input:not(button), [contenteditable]")) {
        this._writeTo(element, name, model)
      }
    } else if(type === "reaction") {
      if(options.reaction.init) {
        options.reaction.init(element, currentModel, modelStack)
        //do this in case init modified the stack
        currentModel = _(modelStack).last()
      } 
      if(options.reaction.afterDOMConstruction) {
        afterDOMConstruction.push(function() { options.reaction.afterDOMConstruction(element, currentModel, that) })
      }
    } else if(type === "afterReaction") {
      if(options.reaction.afterInit) {
        options.reaction.afterInit(element, currentModel, modelStack)
        currentModel = _(modelStack).last()
      }

    }
  })
  _(afterDOMConstruction).each(function(f) { f() })
}

TemplateMethods.bindCollection = function(name, element, model) {
  var Factory = this.collectionFactories[name]
    , CollectionTemplate = Factory.generate(element)
    , collectionModel = this.getFrom(name, model)
    , collectionTemplate

  element.data("collection", collectionModel)

  if(!this.collections[name]) {
    collectionTemplate = new CollectionTemplate(collectionModel)
  } else {
    collectionTemplate = this.collections[name]
    collectionTemplate.bind(collectionModel)
  }
  this.collections[name] = collectionTemplate

  element.data("template", collectionTemplate)
}

TemplateMethods.bindModel = function(name, element, model) {
   var Factory = this.subTemplateFactories[name]
     , Template = Factory.generate()
     , templateModel = this.getFrom(name, model || {})
     , template

   element.data("model", templateModel)
   template = this.models[name] = new Template(templateModel, { container: element })
   if(typeof model.on === "function") {
     model.on("change:" + name, function() {
       template.bind(this.get(name))
     })
   }
   element.data("template", template)
}

TemplateMethods.traverse = function(iterator) {
  _(this.structure).each(function(node) {
    var element
    if(node.selector) {
      element = findDescendantsAndSelf(this.template, node.selector)
    } else {
      element = this.template
    }
    iterator.call(this, node.key, node.type, element, node)
  }, this)
}

