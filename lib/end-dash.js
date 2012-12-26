var _          = require("underscore")
  , CollectionFactory = require("./collection")
  , inflection = require("./inflection")
  , Parser     = require("./parser")
  , util       = require("./util")

/** 
 * A Factory that, given markup, can generate template constructors.  The
 * markup is parsed and the results of the parsed markup are given to the
 * generated Template function as it's prototype.
 **/
function TemplateFactory(markup, opts) {
  opts = opts || {}
  //wrap it in a div so that we always have a root element
  if(!opts.container) {
    opts.container = $("<div>")
  }
  this.container = opts.container
  this.markup = this.container.html(markup)
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
    var match = key.match(/([a-zA-Z ]+)(?:\?([a-zA-Z ]*)\s*)?(?:\:\s*([a-zA-Z ]*))?/)
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
  this.templateProto.structure.push({ key: key, selector: selector, type: "conditional" })

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
        polymorphicValue = "default" //TODO this should be decided by the collection
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
    this.collections = {}
    this.models = {}
    this.bind(data, opts.parentView || null)
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
    })
  }
}

TemplateMethods.bindFrom = function(element, name, model) {
  var that = this
  if(typeof model.set === "function") {
    element.on("change", function() {
      model.set(name, $(this).val())
    })
  }
}

function jqts(element) {
  return $("<div>").append(element.clone()).html()
}

TemplateMethods.bind = function(data, view) {
  var modelStack = [ data ]
    , viewStack = [ view || null ]

  this.traverse(function(name, type, element) {
    if(type == "variable" || type == "conditional") {
      this.setFrom(name, _(modelStack).last())
      this.bindTo(name, _(modelStack).last())
      if(element.is(":input:not(button)")) {
        this.bindFrom(element, name, _(modelStack).last())
      }
    } else if(type == "collection") {
      var Factory = this.collectionFactories[name]
        , CollectionTemplate = Factory.generate(this.template)
        , collectionModel = this.getFrom(name, _(modelStack).last())

      this.collections[name] = new CollectionTemplate(collectionModel, { parentView : _(viewStack).last() || null })
      modelStack.push(collectionModel)
    } else if(type == "view") {
      var View = viewRegistry[inflection.capitalize(name)]
        , parent = _(viewStack).last() || null
        , model = _(modelStack).last()

      if(!View) {
        throw new Error("No such view class " + inflection.capitalize(name))
      }

      opts = { parent: parent, el: element, template: this, model: model }
      view = new View(opts)
      viewStack.push(view)
    } else if(type === "model") {
      var Factory = this.subTemplateFactories[name]
        , Template = Factory.generate()
        , templateModel = this.getFrom(name, _(modelStack).last() || {})
        , template = this.models[name] = new Template(templateModel, { parentView : _(viewStack).last() || null, container: element })
      element.html(template.template)
      modelStack.push(templateModel)
    }
  })
}

function findDescendantsAndSelf(element, selector) {
  var matches = element.find(selector)
  element.each(function(index, element) {
    if(element.nodeType == 1 && $(element).is(selector)) {
      matches = matches.add(element)
    }
  })
  return matches
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
    coll.push(value)
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
      } else if(keyConfig.type === "conditional") {
        if(value === false)
          element.hide()
        else
          element.show()
      } else {
        that.setAttribute(element, keyConfig.attributeName, keyConfig.attributeValue, key, value, keyConfig.valueIfTrue, keyConfig.valueIfFalse)
      }
    })
  }
}

TemplateMethods.traverse = function(iterator) {
  _(this.structure).each(function(node) {
    if(node.selector == "") {
      element = this.container
    } else {
      var element = findDescendantsAndSelf(this.template, node.selector)
    }
    iterator.call(this, node.key, node.type, element)
  }, this)
}

TemplateMethods.setAttribute = function(element, attributeName, attributeValue, replaceKey, replaceValue, valueIfTrue, valueIfFalse) {
  valueIfFalse = valueIfFalse || ""
  if(valueIfTrue) {
    replaceValue = (replaceValue === false) ? valueIfFalse : valueIfTrue
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
