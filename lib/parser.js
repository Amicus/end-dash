var inflection = require("./inflection")
  , Backbone = require("backbone")

var Parser = function(markup) {
  mapElement(markup)
}
_.extend(Parser.prototype, Backbone.Events)

Parser.prototype.parse = function(baseElement) {
  var that = this

  $(baseElement).each(function(i, element) {

    var el = $(element)

    that.parseElement(el)
    that.mapElements(el.children())
  })
}

Parser.prototype.isModel = function(className, el) {
  !!className.match(/(.+)-$/) && el.children().length > 0
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

    var open = []
    _(classes).each(function(className) {
      if(match = className.match(/(.+)-$/)) {
        noDash = className[1]
        //whether or not we're opening a scope
        if(this.isView(className, el)) {
          open.push(noDash)
          this.trigger("view" noDash, el)
        } else if(this.isCollection(className, el)) {
          open.push(noDash)
          this.trigger("collection", noDash, el)
        } else if(this.isModel(className, el) {
          open.push(noDash)
          this.trigger("model", noDash, el)
        } else {
          //this type of variable replaces the innerHTML with it's contents
          this.trigger("variable", noDash, el, "innerHTML")
        }
      }
    }, this)
    if(el[0].hasAttributes()) {
      _.each(el[0].attributes, function(attr) {
        var name = attr.name
          , value = attr.value

        if(variables = value.match(/#\{(.*?)\}/g)) {
          _(variables).each(function(variable) {
            variable = variable.slice(2, -1)
            this.trigger("variable", attribute, el, name)
          }, this)
        }
      }, this)
    }
    that.mapElements(el.children())
    _(open).each(function(name) {
      this.trigger("close", name)
    }, this)
  }
}
