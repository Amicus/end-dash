var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , path = require("path")
  , Backbone = require("backbone")
  , presenterDirectory

var ModelReaction = Reaction.extend({
  selector: "[class]",
 
  getPresenter: function(presenterName, model) {
    var Presenter

    if(!(model instanceof Backbone.Model)) {
      return model
    }
    if(presenterName) {
      if(presenterName.charAt(0) !== "/") {
        presenterName = presenterDirectory + "/" + presenterName
      }
      Presenter = require(presenterName) 
    } else {
      try {
        Presenter = require(presenterDirectory + "/base-presenter")
      } catch(e) {
        Presenter = require("base-presenter")
      }
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
}, {
  setPresenterDirectory: function(dir) {
    presenterDirectory = dir
  }
})

module.exports = ModelReaction
