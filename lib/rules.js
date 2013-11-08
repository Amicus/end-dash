
var rules = module.exports = {},
    inflection = require('inflection'),
    _ = require('underscore');

rules.hasSingularNamedChild = function(el, className) { //Deprecated
  var name = inflection.singularize(className.slice(0, -1));
  return el.children("." + name + "-").length;
};

rules.deprecatedLooping = function(el) { //Deprecated
  var collectionName = firstClassWhere(el, function(className) {
    return this.hasSingularNamedChild(el, className);
  }, this);
  return collectionName ? undash(collectionName) : false;
};

rules.deprecatedLoopingCheck = function(el) { //Deprecated
  loopingName = (this.deprecatedLooping(el) || this.deprecatedLooping(el.parent()));
  if (rules.logger) {
    rules.logger.warn('deprecation', "****ENDDASH-DEPRECATION-WARNING****: collection:" + loopingName);
  }
  return !!loopingName;
};

function uncapitalize(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

function undash(str) {
  return str.replace(/-$/, "");
};

function firstClassWhere(el, cb, context) {
  var classes = (el.attr("class") || "").split(/\s+/);
  return _(classes).find(function(className) {
    if(!className || !className.match(/^.*-$/)) return;
    return cb.call(this, className, el);
  }, context);
};

rules.viewClass = function(className) {
  var match = className.match(/(\S+View)-(?:\s|$)/);
  return (match) ? match[1] : false;
};

rules.conditionalClass = function(className) {
  var match = className.match(/(?:^|\s)(?:isnt|isNot|hasNo|is|has)(\S+)-(?:$|\s)/);
  return (match) ? uncapitalize(match[1]) : false;
};

rules.conditionals = function(el) {
  var conditionals = {};
  el.attr("class").replace(/(?:(?:isnt|isNot|hasNo|is|has)(\S+)-)+/g, function(cond, variableName) {
    rules.negationClass(cond);
    conditionals[uncapitalize(variableName)] = rules.negationClass(cond);
  });
  return conditionals;
};

rules.negationClass = function(className) {
  return !!className.match(/(?:^|\s)(?:isnt|isNot|hasNo)(\S+)-(?:$|\s)/);
};

rules.polymorphicKeyClass = function(el) {
  var match = (el.attr('class') || "").match(/(\S+)Polymorphic-(?:\s|$)/);
  return (match) ? match[1] : "";
};

rules.polymorphicValueClass = function(el) {
  var match = (el.attr('class') || "").match(/when(\S+)-(?:\s|$)/);
  return (match) ? uncapitalize(match[1]) : "";
};

rules.hasPolymorphicClass = function(el) {
  return this.hasPolymorphicKeyClass(el) || this.hasPolymorphicValueClass(el);
};

rules.hasPolymorphicKeyClass = function(el) {
 return !!this.polymorphicKeyClass(el);
};

rules.hasPolymorphicValueClass = function(el) {
 return !!this.polymorphicValueClass(el);
};

rules.looping = function(el) {
  return (el.is("[data-each]"));
};

rules.view = function(el) {
  return el.attr("data-view") || this.viewClass(el.attr("class"));
};

rules.conditional = function(el) {
  return this.conditionalClass(el.attr("class"));
};

rules.negation = function(el) {
  return this.negationClass(el.attr("class"));
};

rules.variable = function(el) {
  if(el.children().length && el.prop("tagName").toLowerCase() !== "select") return;
  var variableName = firstClassWhere(el, function(className) {
    return !this.viewClass(className) &&
           !this.conditionalClass(className);
  }, this);
  if (this.hasPolymorphicClass(el)) {
    return false;
  }
  return (variableName) ? undash(variableName) : false;
};

rules.model = function(el) {
  if(el[0].tagName.toLowerCase() === "select" ||
    this.looping(el) ||
    this.deprecatedLoopingCheck(el) ||
    !el.children().length) {
    return;
  };

  var modelName = firstClassWhere(el, function(className, el) {
    return !this.viewClass(className) &&
           !this.conditionalClass(className) &&
           !this.hasPolymorphicClass(el);
  }, this);
  return (modelName) ? undash(modelName) : false;
};
