var Reaction = require("../reaction")
  , rules = require("../rules")
  , get = require("../util").get
  , path = require("path")
  , _ = require("underscore")
  , presenterDirectory = "/new/views"
  , inferPresenter

var PresenterReaction = Reaction.extend({
  selector: "[data-presenter]",

})

module.exports = PresenterReaction
PresenterReaction.setInferer = function(infer) {
  inferPresenter = infer
}
