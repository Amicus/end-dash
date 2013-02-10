var Parser = require("../parser")
  , Reaction = require("../reaction")
  , inflection = require("../inflection")
  , _ = require("underscore")
  , get = require("../util").get

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
    this.state.itemTemplate = (new Parser(el.children())).generate()
    el.children().remove()
    el.append($("<div>").attr("class", inflection.singularize(this.state.collectionName) + "-"))
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

  setupScope: function(el, model, modelStack) {
    var collection = get(model, this.state.collectionName)
    modelStack.push(collection)
  },
 
  init: function(el, collection) {
    this.container = el.html("")
    el.data("collection", collection)
    this.add(collection)
    if(collection && typeof collection.on === "function") {
      collection.on("sort reset", function(collection) {
        this.container.html("")
        this.add(collection)
      }, this)

      collection.on("add", function(model, collection) {
        var index = collection.indexOf(model)
        this.add(model, { at: index })
      }, this)

      collection.on("remove", function(model, collection, opts) {
        this.container.children().eq(opts.index).remove()
      }, this) 
    }
  },

  teardownScope: function(el, collection, modelStack) {
    modelStack.pop()                      
  }
})

module.exports = CollectionReaction
