var Reaction = require("../reaction")
  , get = require("../util").get
  , rules = require("../rules")
  , path = require("path")

var PartialReaction = Reaction.extend({
  selector: "div[src], li[src], span[src], embed[src]",

  parseOnly: true,

  parse: function(el, state) {
    var src = el.attr("src")
    var file = path.resolve(state.currentDir(), src)
      , template = $(state.templates[file])

    state.pathStack.push(file)
    if(el.attr("type") === "text/x-end-dash") {
      template.insertAfter(el) 
    } else {
      el.html(template) 
    }
  },

  afterParse: function() {
    if(this._toRemove)
      this._toRemove.remove()
  }

})

module.exports = PartialReaction
