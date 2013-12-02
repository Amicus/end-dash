var Reaction = require("../reaction"),
    rules = require("../rules"),
    _ = require("underscore"),
    Backbone = require('../backbone');

var ViewReaction = Reaction.extend({
  name: 'view',
  init: function(next) {
    var EndDash = require('../end-dash'),
        oldView = this.el.data("view"),
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

  setGetView: function() {
    EndDash = require('../end-dash')
    EndDash.setCustomGetView.apply(this, arguments)
  }
});

module.exports = ViewReaction;
