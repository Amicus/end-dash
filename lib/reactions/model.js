var Reaction = require("../reaction"),
    rules = require("../rules"),
    util = require('../util');

var ModelReaction = Reaction.extend({
  init: function(next, reload) {
    var model = this.get(this.modelName);
    model = util.toBackboneModel(model);

    this.el.data("model", model);
    this.stack.push(model);
    this.relevantModels = []
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
