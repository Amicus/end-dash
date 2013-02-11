var Reaction = require("../reaction")
  , inflection = require("../inflection")
  , rules = require("../rules")
  , _ = require("underscore")
 
var viewRegistry = {}

var ViewReaction = Reaction.extend({
  selector: '[data-view], [class$="View-"], [class*="View- "]',

  parse: function(el) {
    return this.state.viewName = rules.view(el)
  }, 

  getViewClass: function(viewName) {
    var viewClass = viewRegistry[inflection.camelize(viewName)]
    if(viewClass) return viewClass

    if(viewName.charAt(0) === "." || viewName.charAt(0) === "/") {
      return require(viewName)
    } else {
      return require("/new/views/" + viewName)
    } 
  },

  afterDOMConstruction: function(element, model, template) {
    var viewName = this.state.viewName
      , viewClass = this.getViewClass(viewName)
      , view, opts

    opts = {
      el: element,
      presenter: $(element).data("presenter"),
      template: template
    }

    if(_.isArray(model) || typeof model.each === "function") {
      opts.collection = model
    } else {
      opts.model = model
    }

    view = this.view = new viewClass(opts)
    element.data("view", view)
  }
})
 
ViewReaction.registerView = function(name, View) {
  viewRegistry[name] = View
}
 
module.exports = ViewReaction
