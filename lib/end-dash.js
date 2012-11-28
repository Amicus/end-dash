var _          = require("underscore")
  , inflection = require("./inflection")
  , Collection = require("./collection")

/** 
 * Constructs a new template 
 **/
function Template(template) {
  this.template = $(template)
  this.keys = {}
  this.collections = {}
  this.mapElements(this.template) 
}

/**
 * This method sets up a map of className- to element 
 * pairs.  Where the element is an element with the
 * class name className-
 **/
Template.prototype.mapElements = function(baseElement) {
  var that = this
  $(baseElement).each(function(i, element) {

    var el = $(element)

    that.setupReplaceables(el)
    that.mapElements(el.children())
  })
}

/** 
 * returns whether className on element refers to a collection 
 **/
Template.prototype.isCollection = function(className, el) {
  var name = inflection.singularize(className.slice(0, -1))
  return el.children("." + name + "-").length > 0
}

/**
 * adds the collection to this templates list of collections
 **/
Template.prototype.mapCollection = function(name, element) {
  this.collections[name] = new Collection(element, inflection.singularize(name))
}

/** 
 * Given an element el, return all classNames or attributes which
 * reference template variables (end in a dash)
 **/
Template.prototype.setupReplaceables = function(el) {
  if(el.attr("class")) {
    var classes = el.attr("class").split(/\s+/)
      , match
    _(classes).each(function(className) {
      if(match = className.match(/(.+)-$/)) {
        if(this.isCollection(className, el)) {
          this.mapCollection(match[1], el)
        } else {
          this.mapElement(match[1], el)
        }
      }
    }, this)
  }

  if(el[0].hasAttributes()) {
    for (var i = 0 ; i < el[0].attributes.length ; i++) {
      var name = el[0].attributes[i].name
        , value = el[0].attributes[i].value

      if(attributes = value.match(/#\{(.*?)\}/g)) {
        _(attributes).each(function(attribute) {
          attribute = attribute.slice(2, -1)
          this.mapElement(attribute, el, { attributeName: name, attributeValue: value, type: "attribute" })
        }, this)
      }
    }
  }
}

Template.prototype.mapElement = function(key, element, opts) {
  opts = opts || {}
  keyConfig = { 
    element: element,
    type: opts.type || "content"
  }

  if(opts.type === "attribute") {
    keyConfig.attributeName = opts.attributeName
    keyConfig.attributeValue = opts.attributeValue
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
      if(keyConfig.type === "content") {
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
