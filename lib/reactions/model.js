var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , path = require("path")

var ModelReaction = Reaction.extend({
  selector: "[class]",
 
  getPresenter: function(presenterName, model) {
    //shitty check for if is backbone
    if(!model.attributes) {
      return model
    }
    var Presenter
    try {
      Presenter = require(presenterName) 
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
    return this.modelName = rules.model(el)
  },

  parse: function(el, state) {
    this.currentDirectory = state.currentDir()
  },

  setupScope: function(el, model, state) {
    var presenter = this.getPresenter(el.attr("data-presenter"), get(model, this.modelName) || {})

    el.data("presenter", presenter)
    el.data("model", presenter.model)

    state.modelStack.push(presenter)
  }
})

module.exports = ModelReaction
