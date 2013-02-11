var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , path = require("path")

PartialReaction = Reaction.extend({
  selector: "div[src], li[src], span[src]",

  parse: function(el, state) {
    var src = el.attr("src")
    var file = path.resolve(state.currentDir(), src)
      , template = $(state.templates[file])

    state.pathStack.push(file)
    if(el.attr("type") === "text/x-end-dash") {
      el.replaceWith(template) 
    } else {
      el.html(template) 
    }
  }
})

module.exports = PartialReaction
