var Reaction = require("../reaction")
  , inflection = require("../inflection")
  , rules = require("../rules")
 
var viewRegistry = {}

var ViewReaction = Reaction.extend({
  selector: '[data-view], [class$="View-"], [class*="View- "]',

  parse: function(el) {
    return this.state.viewName = rules.view(el)
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
