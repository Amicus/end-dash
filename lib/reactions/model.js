var Reaction = require("../reaction")
  , rules = require("../rules")
  , path = require("path")
  , Backbone = require("backbone")
  , _ = require("underscore");

var ModelReaction = Reaction.extend({

  init: function(next, reload) {
    var newModel = this.get(this.modelName);
    if(!(newModel instanceof Backbone.Model || newModel instanceof Backbone.Collection ||
          this.isEndDashCompatible(newModel))) {
      newModel = new Backbone.Model(newModel || {});
    }

    this.el.data("model", newModel);
    this.stack.push(newModel);
    next(reload);
  },

  isEndDashCompatible: function(model) {
    if (!model) {
      return false;
    }
    return (typeof model.on == 'function' &&
            typeof model.once == 'function' &&
            typeof model.set == 'function' &&
            typeof model.get == 'function'
           )
  },

  observe: function(next) {
    this.change(this.modelName, function(model) {
      this.init(next, true);
    }, this);
    if(this.el.is("form")) {
      this.uiEvent("submit", function(e) {
        var objectToSave = this.stack[this.stack.length - 1];
        if (objectToSave.save && objectToSave.save.apply) {
          objectToSave.save();
        }
        e.preventDefault();
      }, this);
    }
  }

}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.model(el)
  },

  parse: function(el, state) {
    return {
      modelName: rules.model(el),
      currentDirectory: state.currentDir()
    }
  }
})

module.exports = ModelReaction;
