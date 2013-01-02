var _          = require("underscore")
  , CollectionFactory = require("./collection")
  , inflection = require("./inflection")
  , Parser     = require("./parser")
  , util       = require("./util")
  , findDescendantsAndSelf = util.findDescendantsAndSelf

/** 
 * A Factory that, given markup, can generate template constructors.  The
 * markup is parsed and the results of the parsed markup are given to the
 * generated Template function as it's prototype.
 **/
function TemplateFactory(markup, opts) {
  opts = opts || {}
  //wrap it in a div so that we always have a root element
  if(!opts.container) {
    this.markup = $("<div>").html(markup)
  } else {
    this.container = opts.container
    this.markup = opts.container
  }
  this.templateProto = { models: {}, collectionFactories: {}, keys: {}, subTemplateFactories: {} }
  this.templateProto.structure = []

  //parse unless the user didn't EXPLICITLY tell the factory not to parse the markup
  if(opts.parse !== false)
    this.parse()
}

var viewRegistry = {}
CollectionFactory.setViewRegistry(viewRegistry)
TemplateFactory.registerView = function(name, View) {
  viewRegistry[name] = View
}

/**
 * Sets up a configuration of a replaceable element.  Will be used as the 
 * prototype of the generated Template function.
 *
 * key - the name of the variable to replace, this will key className- or #{key}
 * in the template
 *
 * element - the element that has the key.
 *
 * name - attribute name to set, will be innerHTML if we want to set the
 * contents of an element.
 *
 * value - The entire value of the attribute, we use this to memoize the
 * initial value, and then replace the #{ part when we set something.
 *
 * @api private
 **/
TemplateFactory.prototype.mapElement = function(key, element, name, value) {
  var type = (name == "innerHTML") ? "innerHTML" : "attribute"
    , selector = util.getSelector(element, this.markup)

  var keyConfig = { 
    selector: selector,
    type: type
  }

  if(type === "attribute") {
    var match = key.match(/([a-zA-Z_\- ]+)(?:\?([a-zA-Z_\- ]*)\s*)?(?:\:\s*([a-zA-Z_\- ]*))?/)
      , valueIfTrue
    key = match[1].replace(/^\s+|\s+$/g, "")
    if(match[2]) {
      valueIfTrue = match[2].replace(/^\s+|\s+$/g, "")
      keyConfig.valueIfTrue = valueIfTrue
    }
    if(match[3]) {
      valueIfFalse = match[3].replace(/^\s+|\s+$/g, "")
      keyConfig.valueIfFalse = valueIfFalse
    }
    keyConfig.attributeName = name
    keyConfig.attributeValue = value
  }
  this.templateProto.structure.push({ key: key, selector: selector, type: "variable" })

  if(this.templateProto.keys[key]) {
    this.templateProto.keys[key].push(keyConfig)
  } else {
    this.templateProto.keys[key] = [keyConfig]
  }
}

/**
 * Maps the collection `name` at element. 
 **/
TemplateFactory.prototype.mapCollection = function(name, element, polymorphicKey) {
  var selector = util.getSelector(element, this.markup)
  this.templateProto.structure.push({ key: name, selector: selector, type: "collection" })
  return this.templateProto.collectionFactories[name] = new CollectionFactory(inflection.singularize(name), selector, polymorphicKey)
}

TemplateFactory.prototype.mapView = function(key, element) {
  var selector = util.getSelector(element, this.markup)
  this.templateProto.structure.push({ key: key, selector: selector, type: "view" })
}

TemplateFactory.prototype.mapConditional = function(key, element) {
  var selector = util.getSelector(element, this.markup)
    , keyConfig = { selector: selector, type: "conditional" }
    , negation

  if(negation = key.match(/not(.+)/)) {
    key = negation[1]
    negation = true
  } else {
    negation = false
  }
  keyConfig.negation = negation

  this.templateProto.structure.push({ key: key, selector: selector, type: "conditional", negation: negation })

  if(this.templateProto.keys[key]) {
    this.templateProto.keys[key].push(keyConfig)
  } else {
    this.templateProto.keys[key] = [keyConfig]
  } 
}

/** 
 * Maps a model (scope), at element
 **/
TemplateFactory.prototype.mapModel = function(name, el) {
  var selector = util.getSelector(el, this.markup)
  this.templateProto.structure.push({ key: name, selector: selector, type: "model" })
  return this.templateProto.subTemplateFactories[name] = new TemplateFactory(el.contents(), { parse: false, container: el })
}

/** 
 * Listens to events on parser and maps the elements found.
 **/
TemplateFactory.prototype.parse = function() {
  var stack = [ this ]
    , collections = []

  this.parser = new Parser(this.markup)

  this.parser.on("collection", function(name, el, polymorphicKey) {
    collection = _(stack).last().mapCollection(name, el, polymorphicKey)
    stack.push(collection)
    collections.push(collection)
  })

  this.parser.on("model", function(name, el, polymorphicValue) {
    var templateFactory
      , parentScope = _(stack).last()
    // if this node's parent is a Collection, we use this model as that
    // collections item template.
    if(parentScope instanceof CollectionFactory) {
      if(polymorphicValue && !parentScope.polymorphicKey) {
        throw new Error("Setting a polymorphic value: " + polymorphicValue + " for a non polymorphic collection")
      } else if(polymorphicValue && !parentScope.polymorphicKey) {
        throw new Error("Polymorphic template with classes " + classes + " has no polymorphic value")
      } else if(!polymorphicValue) { //it's not a polymorphic collection, so we'll name it default
        polymorphicValue = "default" //TODO this should be done by the collection
      }
      templateFactory = parentScope.setTemplateFactory(polymorphicValue, new TemplateFactory(el.remove(), { parse: false }))
    } else {
      templateFactory = parentScope.mapModel(name, el)
    }
    stack.push(templateFactory)
  })
  //call map element on the last item on the stack if it's a variable
  this.parser.on("variable", function(key, element, name, value) {
    _(stack).last().mapElement(key, element, name, value)
  })

  this.parser.on("conditional", function(key, element) {
    _(stack).last().mapConditional(key, element)
  })

  this.parser.on("view", function(key, element) {
    _(stack).last().mapView(key, element)
  })

  this.parser.on("close", function(name) {
    stack.pop()
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
    this.template = $(that.markup.html())
    this.container = opts.container
    if(this.container) {
      this.container.html(this.template)
    }

    this.collections = {}
    this.models = {}
    this.views = []

    this.bind(data)
  }

  Template.prototype = _.extend({}, this.templateProto, TemplateMethods)
  return Template
}


TemplateMethods.getFrom = function(name, object) {
  return (typeof object.get === "function") ? object.get(name) : object[name]
}

TemplateMethods.setFrom = function(name, object) {
  this.set(name, this.getFrom(name, object))
}

TemplateMethods.bindTo = function(name, model) {
  var that = this
  if(typeof model.on === "function") {
    model.on("change:" + name, function() {
      that.set(name, model.get(name))
    }, this)
  }
}

TemplateMethods.bindFrom = function(element, name, model) {
  var that = this
  
  if(typeof model.set === "function") {
    if(this.handler) {
      element.off("change", this.handler)
    }
    this.handler = function() {
        model.set(name, $(this).val())
    }
    element.on("change", this.handler)
  }
}

TemplateMethods.bind = function(data) {
  if(this.container) {
    this.container.data("model", data)
  }
  if(this.bound && this.bound.off) {
    this.bound.off(null, null, this)
  }
  _(this.views).each(function(view) {
    //this method is only in new backbone
    if(view.stopListening)
      view.stopListening()
    view.undelegateEvents()
  })
  this.views = []
  this.bound = data
  var viewInitializers = []

  this.traverse(function(name, type, element) {
    if(type == "variable" || type == "conditional") {
      this.setFrom(name, data)
      this.bindTo(name, data)
      if(element.is(":input:not(button)")) {
        this.bindFrom(element, name, data)
      }
    } else if(type == "collection") {
      this.bindCollection(name, element, data)
    } else if(type == "view") {
      viewInitializers.push(this.bindView(name, element, data))
    } else if(type === "model") {
      this.bindModel(name, element, data)
    }
  })
  _(viewInitializers).each(function(f) { f() })
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

   element.data("template", template)
}

TemplateMethods.bindView = function(name, element, model) {
  var that = this

  //store the views to generate for later, so that
  //after all the other stuff is done, we can create the views
  //this just ensures that views aren't initialized with half 
  //rendered DOM structures
  return function() {
    var View = viewRegistry[inflection.capitalize(name)]
    if(!View) {
      throw new Error("No such view class " + inflection.capitalize(name))
    }
    opts = { el: element, template: that, model: model }
    element.data("template", that)

    if(typeof View !== "function") {
      throw new Error("Cound not find view: " + inflection.capitalize(name))
    }
    view = new View(opts)
    that.views.push(view)

    element.data("view", view)
  }
}

/**
 * Sets any elements referenced by key in the current scope to value in the
 * template.
 **/
TemplateMethods.set = function(key, value) {
  var that = this
    , keyConfigs

  if(typeof key === "object") {
    //iterate attributes if backbone model
    if(key.attributes) {
      key = key.attributes
    }
    return _(key).each(function(v, k) {
      that.set(k, v)
    })
  } 
  if(model = that.models[key]) {
    model.bind(value)
  }
  if(coll = that.collections[key]) {
    coll.bind(value)
  }
  if(keyConfigs = that.keys[key]) {
    _(keyConfigs).each(function(keyConfig) {
      var element = findDescendantsAndSelf(that.template, keyConfig.selector)
      if(keyConfig.type === "innerHTML") {
        if(element.is(":input:not(button)")) {
          element.val(value)
        } else {
          element.html(value)
        }
      }
      else if(keyConfig.type === "conditional") {
        if((keyConfig.negation && !value) || (!keyConfig.negation && value)) {
          element.show()
        } else {
          element.hide()
        }
      } else {
        that.setAttribute(element, keyConfig.attributeName, keyConfig.attributeValue, key, value, keyConfig.valueIfTrue, keyConfig.valueIfFalse)
      }
    })
  }
}
/* Given a name, return the collection or template
 * for the given name.
 *
 * Should it return views? idk, but I don't need it now.
 */
TemplateMethods.get = function(name) {
  if(this.collections[name]) {
    return this.collections[name]
  } else if(this.models[name]) {
    return this.models[name]
  } else {
    throw new Error("Could not find template: " + name)
  }
}

TemplateMethods.traverse = function(iterator) {
  _(this.structure).each(function(node) {
    var element
    if(node.selector) {
      element = findDescendantsAndSelf(this.template, node.selector)
    } else {
      element = this.container
    }
    iterator.call(this, node.key, node.type, element)
  }, this)
}

TemplateMethods.setAttribute = function(element, attributeName, attributeValue, replaceKey, replaceValue, valueIfTrue, valueIfFalse) {
  valueIfFalse = valueIfFalse || ""
  if(valueIfTrue) {
    replaceValue = (replaceValue) ? valueIfTrue : valueIfFalse
  }                                                                                                                                

  var regex = "#{\\s*" + replaceKey + "\\s*"
  if(valueIfTrue) {
    regex += "\\?\\s*" + valueIfTrue + "\\s*"
  }                                    
  if(valueIfFalse) {
    regex += "\\:\\s*" + valueIfFalse + "\\s*"
  }                                    
  regex += "}"
  var newValue = attributeValue.replace(new RegExp(regex), replaceValue)
  element.attr(attributeName, newValue)
}

module.exports = TemplateFactory
