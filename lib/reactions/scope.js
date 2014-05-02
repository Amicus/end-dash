var Reaction = require("../reaction"),
    Backbone = require('../end-dash').Backbone,
    util = require("../util"),
    rules = require("../rules"),
    _ = require("underscore"),
    get = util.get;

var ScopeReaction = Reaction.extend({
  init: function(next) {
    this.origStack = this.stack.slice(0);
    this.stack = this.execPathOnStack(this.el.attr("data-scope"), this.stack);
    next();
  },

  observe: function(next) {
    var that = this;

    var newStack = this.execPathOnStack(this.el.attr("data-scope"), this.origStack, function(segment) {
      var changed = _(that.stack).every(function(model, index) {
        return newStack[index] === model;
      });
      if(changed) {
        that.stack = newStack;
        next(true);
      }
    });
  },

  execPathOnStack: function(path, stack, change) {
    //if it's an absolute path start from the "root" of the stack
    if(path.charAt(0) === '/') {
      stack.splice(1, stack.length - 1);
    }

    _(path.split("/")).each(function(segment) {
      var prev = _(stack).last();
      if(!segment || segment === ".") return;
      if(segment === "..") return stack.pop();

      var val = get(this.getPresenter(_(stack).last()), segment);
      if(typeof val === "undefined") {
        throw new Error("could not find " + segment + " on model " + JSON.stringify(_(stack).last()));
      }
      //in case it's a presenter
      val = (!val.each && val.model) ? val.model : val;

      if(!(val instanceof Backbone.Model || val instanceof Backbone.Collection)) {
        val = new Backbone.Model(val || {});
      }

      stack.push(val);
      if(change && typeof prev.on === "function") {
        this.listenTo(prev, "change:" + segment, function() { change(segment); });
      }
    }, this);
    return stack;
  }

}, {
  selector: "[data-scope]"
});

module.exports = ScopeReaction;
