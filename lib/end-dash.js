var _ = require("underscore")

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
      , classMatch = false
    classes = el.attr("class").split(/\t+/)
    _(classes).each(function(className) {
      var key = className.match(/(.+)-$/)
      if(key && key[1]) {
        classMatch = true
        key = key[1]
        if(that.keys[key]) {
          that.keys[key].push(el)
        } else {
          that.keys[key] = [el]
        }
      }
    })
    //if none of the classes are template classes
    if(!classMatch) {
      that.mapElements($(el.contents()))
    }
  })
}

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
