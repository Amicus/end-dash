var _          = require("underscore")
  , inflection = require("inflection")
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
    if(el.find("*").length == 0) {
      return that.mapContents(el)
    }
    that.mapElements($(el.contents()))
    that.setupCollections(el)
  })
}

/**
 * returns whether the element is an collection or not 
 **/
Template.prototype.setupCollections = function(el) {
  _(this.templateClasses(el)).each(function (className) {
    var name = inflection.singularize(className)
    if(el.children("." + name + "-").length > 0) {
      this.collections[className] = new Collection(el, inflection.singularize(name))
    }
  }, this)
}

/** 
 * Given an element el, return all classNames or attributes which
 * reference template variables (end in a dash)
 **/
Template.prototype.templateClasses = function(el) {
  if(!el.attr("class")) {
    return []
  }
  var classes = el.attr("class").split(/\s+/)
    , templateClasses = []
    , match
  _(classes).each(function(className) {
    if(match = className.match(/(.+)-$/)) {
      templateClasses.push(match[1])
    }
  })
  if(el[0].hasAttributes()) {
    for (var i = 0 ; i < el[0].attributes.length ; i++) {
      var name = el[0].attributes[i].name
        , value = el[0].attributes[i].value
    }
  }
  return templateClasses
}

/**
 * Maps the keys defined in the templates classNames
 * to the element.
 **/
Template.prototype.mapContents = function(el) {
  _(this.templateClasses(el)).each(function(key) {
    if(this.keys[key]) {
      this.keys[key].push(el)
    } else {
      this.keys[key] = [el]
    }
  }, this)  
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
  if(els = that.keys[key]) {
    _(els).each(function(el) {
      el.html(value)
    })
  }
}

module.exports = Template
