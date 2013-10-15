var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , path = require("path")
  , _ = require("underscore")

var PartialReaction = Reaction.extend()

PartialReaction.selector = "div[src], li[src], span[src]"

PartialReaction.preparse = function(el, state) {
  var src = el.attr("src")
    , file = path.resolve(state.currentDir(), src)
    , template = $(state.templates[file])

  if(!template.length) {
    file = src = path.normalize(src)
    template = $(state.templates[src]) // EndDash works with requirejs or <script type='EndDash'> on a page.
  }
  if (!template.length) {
    throw new Error("could not find partial " + file + " in " +  _.last(state.pathStack))
  }
  state.pathStack.push(file)
  el.html(template)
}

PartialReaction.afterPreparse = function(el, state) {
  state.pathStack.pop()
  if(typeof el.attr("data-replace") !== "undefined") {
    var contents = el.contents().remove()
    el.replaceWith(contents)
  }
}

module.exports = PartialReaction
