var Reaction = require("../reaction"),
    rules = require("../rules"),
    util = require('../util');

var ModelReaction = Reaction.extend({

  init: function(next, reload) {
    var newModel = util.toEndDashCompatibleModel(this.get(this.modelName));

    this.el.data("model", newModel);
    this.stack.push(newModel);
    next(reload);
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
    return rules.model(el);
  },

  parse: function(el, state) {
    return {
      modelName: rules.model(el),
      currentDirectory: state.currentDir()
    };
  }
});

module.exports = ModelReaction;
