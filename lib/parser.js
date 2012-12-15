var inflection = require("./inflection")
  , Backbone = require("backbone")
  , _ = require("underscore")

var Parser = module.exports = function(markup) {
  this.markup = markup
}

_.extend(Parser.prototype, Backbone.Events)

Parser.prototype.parse = function(els) {
  var that = this
  if(!els) {
    els = this.markup
  }
  $(els).each(function(i, element) {
    that.parseElement($(element))
  })
}

Parser.prototype.isModel = function(className, el) {
  return el.children().length > 0 || el.parent().is("." + inflection.pluralize(className.slice(0, -1)) + "-")
}
/** 
 * returns whether className on element refers to a collection 
 **/
Parser.prototype.isCollection = function(className, el) {
  var name = inflection.singularize(className.slice(0, -1))
  return el.children("." + name + "-").length > 0
}

Parser.prototype.isView = function(className, el) {
  return !!className.match(/View-$/)
}

Parser.prototype.isConditional = function(className, el) {
  var name = className.match(/is(.+)-/)
  if(name) {
    return name[1].charAt(0).toLowerCase() + name[1].slice(1)
  } else {
    return false
  }
}

Parser.prototype.parseElement = function(el) {
  if(el.attr("class")) {
    var classes = el.attr("class").split(/\s+/)
      , match

    var open = []
    _(classes).each(function(className) {
      if(match = className.match(/(.+)-$/)) {
        var noDash = match[1]
          , conditionalName
        //whether or not we're opening a scope
        if(this.isView(className, el)) {
          open.push(noDash)
          this.trigger("view", noDash, el)
        } else if(this.isCollection(className, el)) {
          open.push(noDash)
          this.trigger("collection", noDash, el)
        } else if(conditionalName = this.isConditional(className, el)) {
        //isConditional returns the name
          this.trigger("conditional", conditionalName, el)
        } else if(this.isModel(className, el)) {
          open.push(noDash)
          this.trigger("model", noDash, el)
        }else {
          //this type of variable replaces the innerHTML of el with it's contents
          this.trigger("variable", noDash, el, "innerHTML")
        }
      }
    }, this)
  }
  if(el[0].hasAttributes()) {
    _.each(el[0].attributes, function(attr) {
      var name = attr.name
        , value = attr.value

      if(variables = value.match(/#\{(.*?)\}/g)) {
        _(variables).each(function(variable) {
          variable = variable.slice(2, -1)
          this.trigger("variable", variable, el, name, value)
        }, this)
      }
    }, this)
  }
  this.parse(el.children())
  _(open).each(function(name) {
    this.trigger("close", name)
  }, this)
}
