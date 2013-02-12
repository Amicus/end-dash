var Parser = require("../parser")
  , Reaction = require("../reaction")
  , inflection = require("inflection")
  , _ = require("underscore")
  , get = require("../util").get
  , rules = require("../rules")

var CollectionReaction = Reaction.extend({
  selector: "[class]",

  reactIf: function(el) {
    return this.state.collectionName = rules.collection(el)
  },

  parse: function(el, state) {
    this.state.itemTemplate = (new Parser(el.children(), { templateName: _.last(state.pathStack) })).generate()
    el.children().remove()
    el.append($("<div>").attr("class", inflection.singularize(this.state.collectionName) + "-"))
  },

  addAll: function(container, models, stack, index) {
    index = index || 0
    if(_.isArray(models)) {
      models = _(models)
    }
    models.each(function(item, index) {
      this.add(container, item, stack, index)
    }, this)
  },

  add: function(container, model, stack, index) {
    var Template = this.state.itemTemplate
      , template = new Template(model, { stack: stack })
      , children

    if(typeof index === "undefined") {
      container.append(template.template)
    } else if(index === 0) {
      container.prepend(template.template)
    } else {
      children = container.children() 
      template.template.insertAfter(children[index - 1])
    }
  },

  setupScope: function(el, model, state) {
    var collection = get(model, this.state.collectionName)
    state.modelStack.push(collection || [])
  },
 
  init: function(container, collection, state) {
    var stack = state.modelStack.slice(0)
    container.data("collection", collection).html("")
    this.addAll(container, collection, stack)
  },

  observe: function(container, collection, state) {
    var stack = state.modelStack.slice(0)
    collection.on("sort reset", function(collection) {
      this.addAll(container.html(""), collection, stack)
    }, this)

    collection.on("add", function(model, collection) {
      this.add(container, model, stack, collection.indexOf(model))
    }, this)

    collection.on("remove", function(model, collection, opts) {
      container.children().eq(opts.index).remove()
    }) 
  }
})

module.exports = CollectionReaction
