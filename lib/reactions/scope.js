var Reaction = require("../reaction"),
    Backbone = require('../end-dash').Backbone,
    util = require("../util"),
    rules = require("../rules"),
    _ = require("underscore"),
    get = util.get;

var ScopeReaction = Reaction.extend({
  init: function(next) {
    this.origStack = this.stack.slice(0);
    this.path = this.el.attr("data-scope")
    this.stack = this.execPathOnStack(this.path, this.stack);
    next();
  },

  observe: function(next) {

    // Since we are scoping, a change is a higher level model changing
    // Try this with scoping down
    var that = this;

    var onChange = function(updateChildren) {
      that.stopListening();
      that.stack = that.origStack.slice(0);
      that.execPathOnStack(that.path, that.stack, onChange);
      if (updateChildren)
        next(true);
    }

    onChange(false)
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
        prev.on("change:" + segment, function() { change(true); });
      }
    }, this);

    return stack;
  }

}, {
  selector: "[data-scope]"
});

module.exports = ScopeReaction;
