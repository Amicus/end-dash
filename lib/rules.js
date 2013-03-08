var inflection = require('inflection')
  , rules = module.exports = {}
  , _ = require('underscore')

function uncapitalize(str) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

function undash(str) {
  return str.replace(/-$/, "")
}

function firstClassWhere(el, cb, context) {
  var classes = (el.attr("class") || "").split(/\s+/)
  return _(classes).find(function(className) {
    if(!className || !className.match(/^.*-$/)) return
    return cb.call(this, className)
  }, context)
}

rules.viewClass = function(className) {
  var match = className.match(/(\S+View)-(?:\s|$)/)
  return (match) ? match[1] : false
}

rules.conditionalClass = function(className) {
  var match = className.match(/(?:^|\s)(?:isnt|isNot|hasNo|is|has)(\S+)-(?:$|\s)/)
  return (match) ? uncapitalize(match[1]) : false
}

rules.negationClass = function(className) {
  var match = className.match(/(?:^|\s)(?:isnt|isNot|hasNo)(\S+)-(?:$|\s)/)
  return !!match
}

rules.polymorphicKeyClass = function(className) {
  var match = className.match(/(\S+)Polymorphic-(?:\s|$)/)
  return (match) ? match[1] : false
}

rules.polymorphicValueClass = function(className) {
  var match = className.match(/when(\S+)-(?:\s|$)/)
  return (match) ? uncapitalize(match[1]) : false
}

rules.polymorphicKey = function(el) {
  return el.attr("data-case") || this.polymorphicKeyClass(el.attr("class"))
}

rules.polymorphicValue = function(el) {
  return el.attr("data-when") || this.polymorphicValueClass(el.attr("class")) || "default"
}

rules.hasSingularNamedChild = function(el, className) {
  var name = inflection.singularize(className.slice(0, -1))
  return el.children("." + name + "-").length
}

rules.collection = function(el) {
  var collectionName = firstClassWhere(el, function(className) {
    return this.hasSingularNamedChild(el, className)
  }, this)
  return collectionName ? undash(collectionName) : false
}

rules.view = function(el) {
  return el.attr("data-view") || this.viewClass(el.attr("class"))
}

rules.conditional = function(el) {
  return this.conditionalClass(el.attr("class"))
}

rules.negation = function(el) {
  return this.negationClass(el.attr("class"))
}

rules.variable = function(el) {
  if(el.children().length && el.prop("tagName").toLowerCase() !== "select") return
  var variableName = firstClassWhere(el, function(className) {
    return !this.viewClass(className) &&
           !this.conditionalClass(className) 
  }, this)
  return (variableName) ? undash(variableName) : false
}

rules.model = function(el) {
  if(el[0].tagName.toLowerCase() === "select" ||
    this.collection(el) ||
    this.collection(el.parent()) ||
    !el.children().length) {
    return
  }

  var modelName = firstClassWhere(el, function(className) {
    return !this.viewClass(className) &&
           !this.conditionalClass(className) 
  }, this)
  return (modelName) ? undash(modelName) : false
}
