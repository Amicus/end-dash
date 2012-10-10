var _ = require("underscore")

/** 
 * Constructs a new template 
 **/
function EndDash(template) {
  this.template = $(template)
  this.keys = {}
  this.mapElements(this.template)
}                               

/**
 * This method sets up a map of className- to element 
 * pairs.  Where the element is an element with the
 * class name className-
 **/
EndDash.prototype.mapElements = function(baseElement) {
  var that = this
  $(baseElement).each(function(i, element) {
    var el = $(element)
    if(el.find("*").length == 0) {
      that.mapContents(el)
    } else {
      that.mapElements($(el.contents()))
    }
  })
}

/** 
 * Given an element el, return all classNames which
 * reference template variables (end in a dash)
 **/
EndDash.prototype.templateClasses = function(el) {
  var classes = el.attr("class").split(/\s+/)
    , templateClasses = []
    , match
  _(classes).each(function(className) {
    if(match = className.match(/(.+)-$/)) {
      templateClasses.push(match[1])
    }
  })
  return templateClasses
}

/**
 * Maps the keys defined in the templates classNames
 * to the element.
 **/
EndDash.prototype.mapContents = function(el) {
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
EndDash.prototype.set = function(key, value) {
  var that = this
  if(typeof key === "object") {
    return _(key).each(function(v, k) {
      that.set(k, v)
    })
  } 
  if(els = that.keys[key]) {
    _(els).each(function(el) {
      el.html(value)
    })
  }
}

if(module && module.exports) {
  module.exports = EndDash
} else if(window) {
  window.EndDash = EndDash
}
