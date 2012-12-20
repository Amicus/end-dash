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
  return (el.children().length > 0 || 
        el.parent().is("." + inflection.pluralize(className.slice(0, -1)) + "-")) &&
        !this.isView(className, el) && !this.isConditional(className, el)
}
 
Parser.prototype.isPolymorphicKey = function(className, el) {
  var match = className.match(/(.*)Polymorphic-/)
  if(match && match[1]) {
    return match[1]
  }
  return false
} 

Parser.prototype.isPolymorphicValue = function(className, el) {
  var match = className.match(/when(.*)-/)
  if(match && match[1]) {
    return match[1][0].toLowerCase() + match[1].slice(1)
  }
  return false
} 
/** 
 * returns whether className on element refers to a collection 
 **/
Parser.prototype.isCollection = function(className, el) {
  var name = inflection.singularize(className.slice(0, -1))
  return el.children("." + name + "-").length > 0 && !this.isView(className, el) && !this.isConditional(className, el)
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
  var children = el.children() //hold on to these right away, just in case we remove them from the parent in the parse process
  if(el.attr("class")) {
    var classes = el.attr("class").split(/\s+/)
      , match
      

    var open = []
    

    var newScope = false
      , scopeType = ""
      , noDash = ""
      , polymorphicKey
      , polymorphicValue
      , p //placeholder

    classes = _(classes).reject(function(className) {
      if(match = className.match(/(.+)-$/)) {
        
      if(p = this.isPolymorphicKey(className, el)) {
        if(polymorphicKey) {
          throw new Error("The element with classes " + classes + " defines multiple polymorphic keys")
        }
        polymorphicKey = p
        return true
      } else if(p = this.isPolymorphicValue(className, el)) {
        if(polymorphicValue) {
          throw new Error("The element with classes " + classes + " defines multiple polymorphic values")
        }
        polymorphicValue = p
        return true
      } else if(this.isCollection(className, el)) { //whether or not we're opening a scope
          if(newScope) {
            throw new Error("The element with classes " + classes + " defines multiple scopes")
          }

          noDash = match[1]
          newScope = true
          scopeType = "collection"
          return true  

        } else if(this.isModel(className, el)) {
          if(newScope) {
            throw new Error("The element with classes " + className + " defines multiple scopes")
          }

          noDash = match[1]
          newScope = true
          scopeType = "model"
          return true  
        }
      }
    }, this)

    // create new scope
    if ( newScope ) {
      open.push(noDash)
      this.trigger(scopeName, noDash, el)
    }

    _(classes).each(function(className) {
      if(match = className.match(/(.+)-$/)) {
        var noDash = match[1]
          , conditionalName
        //whether or not we're opening a scope
        if(this.isView(className, el)) {
          this.trigger("view", noDash, el)
        } else if(conditionalName = this.isConditional(className, el)) {
          //isConditional returns the name
          this.trigger("conditional", conditionalName, el)
        } else {
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
  this.parse(children)
  _(open).each(function(name) {
    this.trigger("close", name)
  }, this)
}
