var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , path = require("path")
  , Backbone = require("backbone")
  , presenterDirectory

var ModelReaction = Reaction.extend({
 
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
        try {
          Presenter = require("base-presenter")
        } catch(e) {}
      }
    }

    if(Presenter) {
      return new Presenter(model)
    }
    return model
  }, 

  setupScope: function(el, model, state) {
    this._parentModel = model
    var newModel = get(model, this.modelName)
    if(!newModel) {
      throw new Error("Could not find model " + this.modelName + " on " + 
        JSON.stringify(model.model && model.model.toJSON && model.model.toJSON() || model))
    }
    var presenter = this.getPresenter(el.attr("data-presenter"), newModel)

    el.data("presenter", presenter)
    el.data("model", newModel)

    state.modelStack.push(presenter)
  },

  observeScope: function(el, model, state) {
    this._parentModel.on("change:" + this.modelName, function(parentModel, newModel) {
      this.triggerScopeChange()
    }, this)
  }
}, {
  selector: "[class]",

  setPresenterDirectory: function(dir) {
    presenterDirectory = dir
  },

  reactIf: function(el) {
    return rules.model(el)
  },
 
  parse: function(el, state) {
    //var template =  new Parser(el.remove(), { templateName: _.last(state.pathStack) })

    return {
      modelName: rules.model(el),
      currentDirectory: state.currentDir()
    }
  }
})

module.exports = ModelReaction

