var Parser = require("../parser")
  , Reaction = require("../reaction")
  , inflection = require("inflection")
  , _ = require("underscore")
  , get = require("../util").get
  , rules = require("../rules")

var CollectionReaction = Reaction.extend({
  selector: "[class]",

  reactIf: function(el) {
    return rules.collection(el)
  },

  parse: function(el, state) {
    this.state.collectionName = rules.collection(el)
    this.state.polymorphicKey = rules.polymorphicKey(el)

    var templates = this.state.itemTemplates = {}
    var children = el.children()
    children.each(function(i, element) {
      var child = $(element).remove()
        , whenValue = rules.polymorphicValue(child)
        , template = (new Parser(child, { templateName: _.last(state.pathStack) }))
      templates[whenValue] = template.generate()
    })

    el.append($("<div>").attr("class", inflection.singularize(this.state.collectionName) + "-"))
  },

  setupScope: function(el, model, state) {
    var collection = get(model, this.state.collectionName)
    state.modelStack.push(collection || [])
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

  getTemplate: function(model) {
    if(this.state.polymorphicKey) {
      var value = get(model, this.state.polymorphicKey)
      return this.state.itemTemplates[value]
    } else {
      return this.state.itemTemplates["default"]
    }
  },

  add: function(container, model, stack, index) {
    var Template = this.getTemplate(model)
      , template = new Template(model, { stack: stack })
      , children
    if(typeof index === "undefined") {
      this.templates.push(template)
      return container.append(template.template)
    } else if(index === 0) {
      this.templates.unshift(template)
      container.prepend(template.template)
    } else {
      this.templates.splice(index, 0, template)
      children = container.children() 
      template.template.insertAfter(children[index - 1])
    }
  },

  remove: function(container, index) {
    container.children().eq(index).remove()
    this.templates.splice(index, 1)
  },
  
  init: function(container, collection, state) {
    this.templates = []
    var stack = state.modelStack.slice(0)
    container.data("collection", collection).html("")
    this.addAll(container, collection, stack)
  },

  observe: function(container, collection, state) {
    var stack = state.modelStack.slice(0)

    if(this.state.polymorphicKey) {
      collection.on("change:" + this.state.polymorphicKey, function(model) {
        var index = collection.indexOf(model)
        this.remove(container, index)
        this.add(container, model, stack, index)
      }, this)
    }
    collection.on("sort reset", function(collection) {
      this.addAll(container.html(""), collection, stack)
    }, this)

    collection.on("add", function(model, collection) {
      this.add(container, model, stack, collection.indexOf(model))
    }, this)

    collection.on("remove", function(model, collection, opts) {
      this.remove(container, opts.index)
    }) 
  }
})
module.exports = CollectionReaction
