var _          = require("underscore")
  , CollectionFactory = require("./collection")
  , inflection = require("./inflection")
  , Parser     = require("./parser")
  , util       = require("./util")

function TemplateFactory(markup) {
  //wrap it in a div so that we always have a root element
  this.markup = $("<div>" + markup + "</div>")
  this.templateProto = { models: {}, collectionFactory: {}, keys: {} }
  this.parse()
}

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
 
TemplateFactory.prototype.mapCollection = function(name, element) {
  return this.templateProto.collectionFactories[name] = new CollectionFactory(inflection.singularize(name), util.getSelector(element, this.markup))
}

TemplateFactory.prototype.mapModel = function(name, el) {
  throw new Error("implement me!")
}

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
    var template
    // if this node's parent is a Collection, we use this model as that
    // collections item template.
    if(_(stack).last() instanceof Collection) {
      template = _(stack).last().template(Template, el)
      stack.push(template)
    } else {
      template = _(stack).last().mapModel(name, el)
      stack.push(template)
    }
  })
  //call map element on the last item on the stack if it's a variable
  this.parser.on("variable", this.mapElement, _(stack).last())

  this.parser.on("close", function() {
    stack.pop()
  })
  this.parser.parse()
  _.invoke(collections, "initialize")
}

/**
 * adds the collection to this templates list of collections
 **/
Template.prototype.mapCollection = function(name, element) {
  return this.collections[name] = new Collection(inflection.singularize(name), element)
}

Template.prototype.mapElement = function(key, element, name, value) {
  var type = (name == "innerHTML") ? "innerHTML" : "attribute"

  keyConfig = { 
    element: element,
    type: type
  }

  if(type === "attribute") {
    keyConfig.attributeName = name
    keyConfig.attributeValue = value
  }

  if(this.keys[key]) {
    this.keys[key].push(keyConfig)
  } else {
    this.keys[key] = [keyConfig]
  }
}

/**
 * Sets any elements referenced by key in the current scope to value in the
 * template.
 **/
Template.prototype.set = function(key, value) {
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
      if(keyConfig.type === "innerHTML") {
        keyConfig.element.html(value)
      } else {
        that.setAttribute(keyConfig.element, keyConfig.attributeName, keyConfig.attributeValue, key, value)
      }
    })
  }
}

Template.prototype.setAttribute = function(element, attributeName, attributeValue, replaceKey, replaceValue) {
  var newValue = attributeValue.replace("#{" + replaceKey + "}", replaceValue)
  element.attr(attributeName, newValue)
}

module.exports = Template
