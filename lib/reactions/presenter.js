var Reaction = require("../reaction")
  , rules = require("../rules")
  , get = require("../util").get
  , path = require("path")
  , presenterDirectory = "/new/views"

var ModelReaction = Reaction.extend({

  getPresenterClass: function(presenterName) {
    this.presenter = path.resolve(this.state.currentDirectory, presenterName)
    return require(presenter)
  }, 

  setupScope: function(el, model, state) {
    var model = state.modelStack.pop()
    var Presenter = this.getPresenterClass(el.attr(this.presenter))
    var presenter = new Presenter(model)
    state.modelStack.push(model)
  }

})


module.exports = ModelReaction
