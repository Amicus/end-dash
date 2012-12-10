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
  this.markup = $("<div></div>").html(markup)
  this.templateProto = { models: {}, collectionFactories: {}, keys: {} }

  //parse unless the user didn't EXPLICITLY tell the factory not to parse the markup
  if(opts.parse !== false)
    this.parse()
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

  keyConfig = { 
    selector: util.getSelector(element, this.markup),
    type: type
  }

  if(type === "attribute") {
    keyConfig.attributeName = name
    keyConfig.attributeValue = value
  }

  if(this.templateProto.keys[key]) {
    this.templateProto.keys[key].push(keyConfig)
  } else {
    this.templateProto.keys[key] = [keyConfig]
  }
}
/**
 * Maps the collection `name` at element. 
 **/
 
TemplateFactory.prototype.mapCollection = function(name, element) {
  return this.templateProto.collectionFactories[name] = new CollectionFactory(inflection.singularize(name), util.getSelector(element, this.markup))
}

/** 
 * Maps a model (scope), at element
 **/
TemplateFactory.prototype.mapModel = function(name, el) {
  throw new Error("implement me!")
}

/** 
 * Listens to events on parser and maps the elements found.
 **/
TemplateFactory.prototype.parse = function() {
  var stack = [ this ]
    , collections = []

  this.parser = new Parser(this.markup)

  this.parser.on("collection", function(name, el) {
    collection = _(stack).last().mapCollection(name, el)
    stack.push(collection)
    collections.push(collection)
  })

  this.parser.on("model", function(name, el) {
    var templateFactory
    // if this node's parent is a Collection, we use this model as that
    // collections item template.
    if(_(stack).last() instanceof CollectionFactory) {
      templateFactory = _(stack).last().setTemplateFactory(new TemplateFactory(el.remove(), { parse: false }))
      stack.push(templateFactory)
    } else {
      templateFactory = _(stack).last().mapModel(name, el)
      stack.push(templateFactory)
    }
  })
  //call map element on the last item on the stack if it's a variable
  this.parser.on("variable", function(key, element, name, value) {
    _(stack).last().mapElement(key, element, name, value)
  })

  this.parser.on("close", function() {
    stack.pop()
  })
  this.parser.parse()
}

var TemplateMethods = {}

TemplateFactory.prototype.generate = function() {
  var that = this
  function Template() {
    //only take the inner html to "unwrap" the containing div from above
    this.template = $(that.markup.html())
    this.collections = {}
    _(this.collectionFactories).each(function(Factory, name) {
      Collection = Factory.generate(this.template)
      this.collections[name] = new Collection
    }, this)
  }

  Template.prototype = _.extend({}, this.templateProto, TemplateMethods)
  return Template
}

/**
 * Sets any elements referenced by key in the current scope to value in the
 * template.
 **/
TemplateMethods.set = function(key, value) {
  var that = this
  if(typeof key === "object") {
    return _(key).each(function(v, k) {
      that.set(k, v)
    })
  } 
  if(coll = that.collections[key]) {
    coll.push(value)
  }
  if(keyConfigs = that.keys[key]) {
    _(keyConfigs).each(function(keyConfig) {
      var element = that.template.find(keyConfig.selector)
      if(element.length == 0) {
        if(that.template.is(keyConfig.selector)) {
          element = that.template
        } else {
          throw new Error("A template variable got lost somewhere")
        }
      }
      if(keyConfig.type === "innerHTML") {
        element.html(value)
      } else {
        that.setAttribute(element, keyConfig.attributeName, keyConfig.attributeValue, key, value)
      }
    })
  }
}

TemplateMethods.setAttribute = function(element, attributeName, attributeValue, replaceKey, replaceValue) {
  var newValue = attributeValue.replace("#{" + replaceKey + "}", replaceValue)
  element.attr(attributeName, newValue)
}

module.exports = TemplateFactory
