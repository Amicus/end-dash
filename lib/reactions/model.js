var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , path = require("path")

var ModelReaction = Reaction.extend({
  selector: "[class]",
 
  getPresenter: function(presenterName, model) {
    this.presenterPath = path.resolve(this.state.currentDirectory, presenterName)
    var Presenter
    try {
      Presenter = require(presenterPath) 
    } catch(e) {
      try {
        Presenter = require("base-presenter")
      } catch(e) {}
    }
    if(Presenter) {
      return new Presenter(model)
    }
    return model
  }, 

  reactIf: function(el) {
    return this.state.modelName = rules.model(el)
  },

  parse: function(el, state) {
    this.state.currentDirectory = state.currentDir()
  },

  setupScope: function(el, model, state) {
    var presenter = this.getPresenter(el.attr("data-presenter"), get(model, this.state.modelName) || {})
    state.modelStack.push(presenter)
  }
})

module.exports = ModelReaction
