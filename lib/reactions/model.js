var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , path = require("path")
  , Backbone = require("backbone")
  , _ = require("underscore")
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

  init: function(el, model, stack, next, reload) {
    var newModel = get(model, this.modelName) || {}
    var presenter = this.getPresenter(el.attr("data-presenter"), newModel)

    this._parentModel = model
    this._parentStack = stack.slice(0)
    this._reloadChildren = next

    el.data("presenter", presenter)
    el.data("model", newModel)

    stack.push(presenter)
    next(stack, reload)
  },

  observe: function(el, model, stack, next) {
    var parentStack = stack.slice(0, -1)
      , parentModel = _.last(parentStack)
    if(typeof parentModel.on === "function") {
      parentModel.on("change:" + this.modelName, function(model) {
        this.init(el, model, parentStack, next, true)
      }, this)
    }
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

