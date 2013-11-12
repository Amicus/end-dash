var Reaction = require("../reaction"),
    rules = require("../rules"),
    _ = require("underscore"),
    EndDash = require('../end-dash'),
    Backbone = EndDash.Backbone;

var ViewReaction = Reaction.extend({
  init: function(next) {
    var oldView = this.el.data("view"),
        viewClass = EndDash.viewStore.getView(this.viewName),
        view, opts;

    if (typeof oldView === "object") {
      oldView.stopListening();
      oldView.undelegateEvents();
    }

    /**
     * ensure that next is called before the view is inited
     * because, we don't want to setup a view until the child
     * dom is ready.
     **/
    next();

    opts = {
      el: this.el,
      presenter: this.presenter
    };

    if (_.isArray(this.model) || this.model instanceof Backbone.Collection) {
      opts.collection = this.model;
    } else {
      opts.model = this.model;
    }

    view = new viewClass(opts);
    this.el.data("view", view);
  }

}, {
  selector: '[data-view], [class$="View-"], [class*="View- "]',

  parse: function(el) {
    return { viewName: rules.view(el) };
  },

  setGetView: EndDash.setCustomGetView
});

module.exports = ViewReaction;
