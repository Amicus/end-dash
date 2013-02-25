var Reaction = require("../reaction")
  , util = require("../util")
  , rules = require("../rules")
  , _ = require("underscore")
  , get = util.get

var ScopeReaction = Reaction.extend({
  init: function(next) {
    this.execPathOnStack(this.el.attr("data-scope"))
    next()
  },
 
  execPathOnStack: function(path) {
    //if it's an absolute path start from the "root" of the stack
    if(path.charAt(0) === '/') {
      this.stack.splice(1, this.stack.length - 1)
    }

    _(path.split("/")).each(function(segment) {
      if(!segment || segment === ".") return
      if(segment === "..") return this.stack.pop()

      var val = get(this.getPresenter(_(this.stack).last()), segment)
      if(typeof val === "undefined") {
        throw new Error("could not find " + segment + " on model " + JSON.stringify(_(this.stack).last()))
      }
      val = (!val.each && val.model) ? val.model : val
      this.stack.push(val)
    }, this)
  }
 
}, {
  selector: "[data-scope]"
})

module.exports = ScopeReaction  
