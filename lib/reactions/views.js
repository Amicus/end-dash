var Reaction = require("../reaction")
  , inflection = require("../inflection")
 
var viewRegistry = {}

var ViewReaction = Reaction.extend({
  selector: '[data-view], [class$="View-"], [class*="View- "]',

  parse: function(el) {
    var viewName = $(el).attr("data-view")
      , viewMatch

    if(!viewName) {
      viewMatch = $(el).attr("class").match(/(\S+View)-/)
      if(viewMatch) {
        viewName = inflection.underscore(viewMatch[1])
        if(!process || !process.env || process.env.NODE_ENV != "test") {
          console.warn("DEPRECATION WARNING: You're using the deprecated View- className syntax for class " + viewName)
        }
      }
    }
    this.state.viewName = viewName
  }, 

  // Do this after the dom is setup, so we have access to parent elements
  // and to the model when we init the view.
  afterDOMConstruction: function(element, model, template) {
    var viewName = this.state.viewName
      , viewClass, view, opts
    //if it's an absolute or relative path, we'll just require it.
    if(viewName.charAt(0) === "." || viewName.charAt(0) === "/") {
      viewClass = require(viewName)
    } else if(!(viewClass = viewRegistry[inflection.camelize(viewName)])) {
      viewClass = require("/new/views/" + viewName)
    }

    if(this.view) {
      view.undelegateEvents()
      if(view.stopListening) //only in new Backbone
        view.stopListening()
    }

    opts = {
      el: element,
      presenter: $(element).data("presenter"),
      template: template
    }

    if(!(opts.collection = element.data("collection"))) {
      opts.model = $(element).data("model") || model
    }

    view = this.view = new viewClass(opts)
    element.data("view", view)
  }
})
 
ViewReaction.registerView = function(name, View) {
  viewRegistry[name] = View
}
 
module.exports = ViewReaction
