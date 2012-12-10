var _          = require("underscore")
  , CollectionFactory = require("./collection")
  , inflection = require("./inflection")
  , Parser     = require("./parser")
  , util       = require("./util")

function TemplateFactory(markup, parse) {
  if(typeof parse === "undefined")
    parse = true

  //wrap it in a div so that we always have a root element
  this.markup = $("<div></div>").html(markup)
  this.templateProto = { models: {}, collectionFactories: {}, keys: {} }
  if(parse)
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
    var templateFactory
    // if this node's parent is a Collection, we use this model as that
    // collections item template.
    if(_(stack).last() instanceof CollectionFactory) {
      templateFactory = _(stack).last().setTemplateFactory(new TemplateFactory(el.remove()))
      stack.push(templateFactory)
    } else {
      templateFactory = _(stack).last().mapModel(name, el)
      stack.push(templateFactory)
    }
  })
  //call map element on the last item on the stack if it's a variable
  this.parser.on("variable", this.mapElement, _(stack).last())

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
      this.collections[name] = Factory.generate(this.template)
    }, this)
  }

  Template.prototype = _.extend({}, this.templateProto, TemplateMethods)
  return Template
}


TemplateMethods.bind = function(fields, bindTo) {
  var that = this
  if(!_.isArray(fields)) {
    fields = [ fields ]
  }
  _.each(fields, function(field) {
    if(typeof bindTo.get === "function") {
      that.set(field, bindTo.get(field))
    }
    if(typeof bindTo.on === "function") {
      bindTo.on("change:" + field, function() {
        that.set(field, bindTo.get(field))
      })
    }
  })
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
