var inflection = require("./inflection")
  , Backbone = require("backbone")
  , _ = require("underscore")

var Parser = module.exports = function(markup) {
  this.markup = markup
}

_.extend(Parser.prototype, Backbone.Events)

Parser.prototype.parse = function(els) {
  var that = this
  this.stack = []
  if(!els) {
    els = this.markup
  }
  $(els).each(function(i, element) {
    that.parseElement($(element))
  })
}

Parser.prototype.isModel = function(className, el) {
  return el.children().length > 0
}
/** 
 * returns whether className on element refers to a collection 
 **/
Parser.prototype.isCollection = function(className, el) {
  var name = inflection.singularize(className.slice(0, -1))
  return el.children("." + name + "-").length > 0
}

Parser.prototype.isView = function(className, el) {
  !!className.match(/(.+)View-$/)
}

Parser.prototype.parseElement = function(el) {
  if(el.attr("class")) {
    var classes = el.attr("class").split(/\s+/)
      , match
    /** 
     * maintain a stack of scopes, and pass it in, dot.ified.model
     **/
    var open = []
    _(classes).each(function(className) {
      if(match = className.match(/(.+)-$/)) {
        noDash = match[1]
        //whether or not we're opening a scope
        if(this.isView(className, el)) {
          this.stack.push(noDash)
          open.push(noDash)
          this.trigger("view", noDash, el, this.stack.join("."))
        } else if(this.isCollection(className, el)) {
          this.stack.push(noDash)
          open.push(noDash)
          this.trigger("collection", noDash, el, this.stack.join("."))
        } else if(this.isModel(className, el)) {
          open.push(noDash)
          this.trigger("model", noDash, el, this.stack.join("."))
        } else {
          //this type of variable replaces the innerHTML of el with it's contents
          this.trigger("variable", noDash, el, "innerHTML", undefined, this.stack.join("."))
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
