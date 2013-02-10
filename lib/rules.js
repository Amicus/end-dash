var inflection = require('./inflection')
  , rules = module.exports = {}
  , _ = require('underscore')

function undash(str) {
  return str.replace(/-$/, "")
}

rules.model = function(el) {
   if(el[0].tagName.toLowerCase() === "select" ||
     this.collection(el) ||
     this.collection(el.parent()) ||
     !el.children().length) {
     return
   }

   var modelName = this.firstClassWhere(el, function(className) {
     return !this.viewClass(className) &&
            !this.conditionalClass(className) 
   })
   return (modelName) ? undash(modelName) : false
}

rules.viewClass = function(className) {
  var match = className.match(/(.*View)-(?:\s|$)/)
  return (match) ? match[1] : false
}
 
rules.conditionalClass = function(className) {
  var match = className.match(/is(\S+)-/)
  return (match) ? match[1] : false
}

rules.polymorphicKey = function(el) {
  var match = el.attr("class").match(/(\S+)Polymorphic-(?:\s|$)/)
  return (match) ? match[1] : false
}

rules.polymorphicValue = function(el) {
  var match = el.attr("class").match(/when(\S+)-(?:\s|$)/)
  return (match) ? inflection.uncapitalize(match[1]) : false
}

rules.hasSingularNamedChild = function(el, className) {
  var name = inflection.singularize(className.slice(0, -1))
  return el.children("." + name + "-").length
}

rules.firstClassWhere = function(el, cb) {
  var classes = (el.attr("class") || "").split(/\s+/)
  return _(classes).find(function(className) {
    if(!className || !className.match(/^.*-$/)) return
    return cb.call(this, className)
  }, this)
}

rules.collection = function(el) {
  var collectionName = this.firstClassWhere(el, function(className) {
    return this.hasSingularNamedChild(el, className)
  })
  return collectionName ? undash(collectionName) : false
}

rules.view = function(el) {
  return el.attr("[data-view]") || this.viewClass(el.attr("class"))
}

rules.conditional = function(el) {
  var name = this.conditionalClass(el.attr("class"))
  return (match) ? inflection.uncapitalize(match[1]) : false
} 
