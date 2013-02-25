var Reaction = require("../reaction")
  , inflection = require("inflection")
  , rules = require("../rules")
  , Backbone = require("backbone")
  , _ = require("underscore")
  , getView
 
var viewRegistry = {}

var ViewReaction = Reaction.extend({

  observe: function() {
    var viewClass = getView(this.viewName)
      , view, opts

    opts = {
      el: this.el,
      presenter: this.presenter
    }

    if(_.isArray(this.model) || this.model instanceof Backbone.Collection) {
      opts.collection = this.model
    } else {
      opts.model = this.model
    }
    view = new viewClass(opts)
    this.el.data("view", view)
  }
}, {
  selector: '[data-view], [class$="View-"], [class*="View- "]',

  parse: function(el) {
    return {
      viewName: rules.view(el)
    }
  },

  setGetView: function(getViewFn) {
    getView = getViewFn
  }
})
 
module.exports = ViewReaction
