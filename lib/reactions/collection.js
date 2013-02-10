var TemplateFactory = require("../end-dash")
  , Reaction = require("../reaction")
  , inflection = require("../inflection")
  , _ = require("underscore")
  , get = require("../util").get
//TODO put in util 

var CollectionReaction = Reaction.extend({
  selector: "[class]",

  reactIf: function(el) {
    return _($(el).attr("class").split(/\s/)).any(function(className) {
      if(!className || !className.match(/-$/)) return

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
    this.state.itemTemplate = new TemplateFactory(el.children()).generate()
    el.children().remove()
    el.append($("<div>"))
  },

  add: function(model, opts) {
    if(_.isArray(model) || _.isArray(model.models)) {
      if(model.models) {
        model = model.models
      }
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
 
  init: function(el, model, modelStack) {
    var collection = get(model, this.state.collectionName)
    this.container = el.html("")
    el.data("collection", collection)
    this.add(collection)
    if(typeof collection.on === "function") {
      collection.on("sort reset", function(collection) {
        this.container.html("")
        this.add(collection)
      }, this)
    }
  },

  afterInit: function(el, model, modelStack) {
    modelStack.pop()                      
  }
})

module.exports = CollectionReaction
