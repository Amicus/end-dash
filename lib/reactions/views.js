var Reaction = require("../reaction")
  , inflection = require("inflection")
  , rules = require("../rules")
  , _ = require("underscore")
  , Backbone = require("backbone")
 
var viewRegistry = {}

var ViewReaction = Reaction.extend({
  selector: '[data-view], [class$="View-"], [class*="View- "]',

  parse: function(el) {
    console.log(rules.view(el))
    return this.state.viewName = rules.view(el)
  }, 

  getViewClass: function(viewName) {
    var viewClass = viewRegistry[viewName]
    if(viewClass) return viewClass

    if(viewName.charAt(0) === "." || viewName.charAt(0) === "/") {
      return require(viewName)
    } else {
      return require("/new/views/" + inflection.underscore(viewName))
    } 
  },

  afterDOMConstruction: function(element, model, template) {
    var viewName = this.state.viewName
      , viewClass = this.getViewClass(viewName)
      , view, opts

    opts = {
      el: element,
      template: template
    }

    if(_.isArray(model) || typeof model.each === "function") {
      opts.collection = model
    } else {
      opts.model = model
    }

    if(model.model && model.model instanceof Backbone.Model) {
      opts.presenter = opts.model
      opts.model = opts.presenter.model
    }

    view = this.view = new viewClass(opts)
    element.data("view", view)
  }
})
 
ViewReaction.registerView = function(name, View) {
  viewRegistry[name] = View
}
 
module.exports = ViewReaction
