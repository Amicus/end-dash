var TemplateFactory = require("../end-dash")
  , Reaction = require("../reaction")
  , inflection = require("../inflection")
  , _ = require("underscore")

var CollectionReaction = Reaction.extend({
  selector: "*",

  reactIf: function(el) {
    return _($(el).attr("class").split('\s')).any(function(className) {
      childClassName = inflection.singularize(className.slice(0, -1))
      var children = el.children("." + childClassName + "-").length > 0
      if(children) {
        this.state.collectionName = className.slice(0, -1)
        return true
      }
    }, this)
  },

  parse: function(el) {
    //this.pushScope(th.state.collectionName)
    //we're assuming there is only one item for now
    this.state.itemTemplate = new TemplateFactory(el.children().remove()).generate()
  },

  add: function(model, opts) {
    if(typeof model.each === "function" || _.isArray(model)) {
      _.each(model, function(item, index) {
        var at
        if(opts && opts.at) {
          at = opts.at + index
        }
        this.add(item, { at: at })
      }, this)
      return
    }
    var Template = this.state.itemTemplate
      , children = this.container.children()
      , template = new Template(model)
      , opts = {}

    if(typeof opts.at === "undefined") {
      this.container.append(template.template)
    } else if(opts.at === 0) {
      this.container.prepend(template.template)
    } else {
      template.template.insertAfter(children[opts.at - 1])
    }
  },
 
  init: function(el, collection) {
    this.container = el
    this.add(collection)
  }

})

module.exports = CollectionReaction
